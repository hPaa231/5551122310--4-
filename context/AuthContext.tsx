"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/lib/auth-service"

interface User {
  id: number
  email: string
  nickname: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // JWT 토큰 디코딩 함수
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error("❌ JWT 디코딩 오류:", error)
      return null
    }
  }

  // 토큰 갱신
  const refreshToken = async (): Promise<boolean> => {
    console.log("🔄 토큰 갱신 시도 중...")
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken")
      const refreshTokenExpiration = localStorage.getItem("refreshTokenExpiration")

      if (!refreshTokenValue) {
        console.log("❌ 리프레시 토큰이 없음")
        return false
      }

      // 리프레시 토큰 만료 확인
      if (refreshTokenExpiration) {
        const currentTime = Date.now()
        const expirationTime = Number.parseInt(refreshTokenExpiration)
        if (currentTime >= expirationTime) {
          console.log("❌ 리프레시 토큰도 만료됨")
          authService.clearTokens()
          setUser(null)
          setIsAuthenticated(false)
          return false
        }
      }

      const response = await authService.reissueToken(refreshTokenValue)
      if (response.data) {
        console.log("✅ 토큰 갱신 성공")
        authService.saveTokens(response.data)

        // JWT에서 사용자 정보 추출
        const payload = decodeJWT(response.data.accessToken)
        if (payload && payload.sub) {
          const userData = {
            id: Number.parseInt(payload.sub),
            email: user?.email || "unknown@example.com",
            nickname: user?.nickname || "사용자",
          }
          setUser(userData)
          setIsAuthenticated(true)
          console.log("👤 토큰 갱신 후 사용자 정보:", userData)
        }

        return true
      }
      return false
    } catch (error: any) {
      console.error("❌ 토큰 갱신 오류:", error.message)

      // 토큰 만료 관련 에러인 경우 토큰 정리
      if (
        error.message.includes("Expired") ||
        error.message.includes("expired") ||
        error.message.includes("Invalid") ||
        error.message.includes("invalid")
      ) {
        console.log("🧹 만료된 토큰 정리 중...")
        authService.clearTokens()
        setUser(null)
        setIsAuthenticated(false)
      }
      return false
    }
  }

  // 로그인
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔑 로그인 시도 중...")
    try {
      const response = await authService.login(email, password)
      console.log("📦 로그인 응답:", response)

      if (response.data) {
        console.log("✅ 로그인 성공, 토큰 저장 중...")
        authService.saveTokens(response.data)

        // JWT에서 사용자 정보 추출
        const payload = decodeJWT(response.data.accessToken)
        console.log("🔍 JWT 페이로드:", payload)

        if (payload && payload.sub) {
          const userData = {
            id: Number.parseInt(payload.sub),
            email: email,
            nickname: email.split("@")[0], // 이메일에서 닉네임 추출
          }
          setUser(userData)
          setIsAuthenticated(true)
          console.log("👤 사용자 정보 저장 완료:", userData)

          // 로그인 성공 후 AuthService에도 사용자 정보 저장
          authService.saveUser(userData)

          return true
        } else {
          console.error("❌ JWT에서 사용자 ID를 찾을 수 없음")
          return false
        }
      }
      return false
    } catch (error: any) {
      console.error("❌ 로그인 오류:", error.message)
      return false
    }
  }

  // 로그아웃
  const logout = () => {
    console.log("🚪 로그아웃 중...")
    authService.clearTokens()
    setUser(null)
    setIsAuthenticated(false)
    console.log("✅ 로그아웃 완료")

    authService.clearTokens()
  }

  // 토큰 유효성 검사 (단순화)
  const isTokenValid = (): boolean => {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem("accessToken")
    const expiration = localStorage.getItem("accessTokenExpiration")

    if (!token || !expiration) {
      return false
    }

    const currentTime = Date.now()
    const expirationTime = Number.parseInt(expiration)
    return currentTime < expirationTime
  }

  // 리프레시 토큰 유효성 검사
  const isRefreshTokenValid = (): boolean => {
    if (typeof window === "undefined") return false

    const refreshToken = localStorage.getItem("refreshToken")
    const expiration = localStorage.getItem("refreshTokenExpiration")

    if (!refreshToken || !expiration) {
      console.log("❌ 리프레시 토큰 또는 만료 시간이 없음")
      return false
    }

    const currentTime = Date.now()
    const expirationTime = Number.parseInt(expiration)
    const isValid = currentTime < expirationTime

    console.log("🔍 리프레시 토큰 유효성 검사:")
    console.log("- 현재 시간:", currentTime)
    console.log("- 만료 시간:", expirationTime)
    console.log("- 유효 여부:", isValid)

    return isValid
  }

  // 초기화 시 토큰 확인 (개선된 버전)
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔍 인증 상태 초기화 중...")

      const token = localStorage.getItem("accessToken")
      const refreshTokenValue = localStorage.getItem("refreshToken")

      if (!token || !refreshTokenValue) {
        console.log("❌ 저장된 토큰이 없음")
        setLoading(false)
        return
      }

      // 토큰이 있으면 일단 사용자 정보 복원 시도
      try {
        const payload = decodeJWT(token)
        if (payload && payload.sub) {
          const savedEmail = localStorage.getItem("userEmail")
          const savedNickname = localStorage.getItem("userNickname")

          const userData = {
            id: Number.parseInt(payload.sub),
            email: savedEmail || "unknown@example.com",
            nickname: savedNickname || "사용자",
          }

          console.log("👤 토큰에서 사용자 정보 복원:", userData)
          setUser(userData)
          setIsAuthenticated(true)

          // 토큰에서 사용자 정보 복원 후 AuthService에도 저장
          authService.saveUser(userData)
        }
      } catch (error) {
        console.error("❌ 토큰 디코딩 실패:", error)
      }

      // 토큰 유효성 검사 (백그라운드에서)
      if (!isTokenValid()) {
        console.log("⚠️ 액세스 토큰이 만료됨, 갱신 시도...")

        // 리프레시 토큰도 만료되었는지 확인
        const refreshTokenExpiration = localStorage.getItem("refreshTokenExpiration")
        if (refreshTokenExpiration) {
          const currentTime = Date.now()
          const expirationTime = Number.parseInt(refreshTokenExpiration)
          if (currentTime >= expirationTime) {
            console.log("❌ 리프레시 토큰도 만료됨, 로그아웃 처리")
            logout()
            setLoading(false)
            return
          }
        }

        // 백그라운드에서 토큰 갱신 시도
        setTimeout(async () => {
          const refreshSuccess = await refreshToken()
          if (!refreshSuccess) {
            console.log("❌ 토큰 갱신 실패")
            // 갱신 실패해도 바로 로그아웃하지 않고, 다음 API 호출에서 처리
          }
        }, 100)
      } else {
        console.log("✅ 유효한 토큰 확인됨")
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  // 사용자 정보가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    if (user) {
      localStorage.setItem("userEmail", user.email)
      localStorage.setItem("userNickname", user.nickname)
    } else {
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userNickname")
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

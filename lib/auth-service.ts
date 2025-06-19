import { apiClient, type ApiResponse } from "./api-client"
import type {
  LoginResponseDto,
  LoginRequestDto,
  JoinRequestDto,
  OAuth2JoinRequestDto,
  VerifyCodeDto,
  ReissueRequestDto,
  User,
} from "@/types/api-types"

export class AuthService {
  // 일반 로그인
  async login(email: string, password: string): Promise<ApiResponse<LoginResponseDto>> {
    console.log("🔑 AuthService.login 호출됨:", { email })

    const loginData: LoginRequestDto = { email: email.trim(), password }

    try {
      const response = await apiClient.post<LoginResponseDto>("/api/auth/login", loginData, false)
      console.log("📥 AuthService 로그인 성공")

      if (response.data) {
        this.saveTokens(response.data)
        await this.fetchAndSaveUserInfo()
      }

      return response
    } catch (error: any) {
      console.error("❌ AuthService 로그인 오류:", error)

      if (error.message.includes("401")) {
        throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.")
      } else if (error.message.includes("400")) {
        throw new Error("입력 정보를 확인해주세요.")
      } else if (error.message.includes("500")) {
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }

      throw error
    }
  }

  // OAuth2 로그인
  async oauth2Login(provider: string, code: string): Promise<ApiResponse<LoginResponseDto>> {
    const response = await apiClient.post<LoginResponseDto>(`/api/auth/login/${provider}`, code, false)

    if (response.data) {
      this.saveTokens(response.data)
      await this.fetchAndSaveUserInfo()
    }

    return response
  }

  // 일반 회원가입
  async join(email: string, password: string, nickname: string, image?: File): Promise<ApiResponse<any>> {
    console.log("📝 AuthService.join 호출됨:", { email, nickname })

    const formData = new FormData()
    const joinData: JoinRequestDto = { email: email.trim(), password, nickname: nickname.trim() }

    formData.append("data", JSON.stringify(joinData))
    if (image) {
      formData.append("image", image)
    }

    try {
      const response = await apiClient.postFormData<any>("/api/auth/join", formData, false)
      console.log("📥 회원가입 응답:", response)
      return response
    } catch (error) {
      console.error("❌ AuthService 회원가입 오류:", error)
      throw error
    }
  }

  // OAuth2 회원가입
  async oauth2Join(
    provider: string,
    email: string,
    nickname: string,
    code: string,
    image?: File,
  ): Promise<ApiResponse<LoginResponseDto>> {
    const formData = new FormData()
    const joinData: OAuth2JoinRequestDto = { email, nickname, code }

    formData.append("data", JSON.stringify(joinData))
    if (image) {
      formData.append("image", image)
    }

    const response = await apiClient.postFormData<LoginResponseDto>(`/api/auth/join/${provider}`, formData, false)

    if (response.data) {
      this.saveTokens(response.data)
      await this.fetchAndSaveUserInfo()
    }

    return response
  }

  // 이메일 인증 코드 전송
  async sendEmailCode(email: string): Promise<ApiResponse<any>> {
    console.log("📧 AuthService.sendEmailCode 호출됨:", { email })

    try {
      const response = await apiClient.post<any>("/api/auth/send-email", email.trim(), false)
      console.log("📥 이메일 코드 전송 응답:", response)
      return response
    } catch (error) {
      console.error("❌ AuthService 이메일 코드 전송 오류:", error)
      throw error
    }
  }

  // 이메일 인증 코드 검증
  async verifyEmailCode(email: string, code: string): Promise<ApiResponse<any>> {
    console.log("🔍 AuthService.verifyEmailCode 호출됨:", { email, code })

    try {
      const cleanEmail = email.trim().toLowerCase()
      const cleanCode = code.trim()

      if (!cleanEmail || !cleanCode) {
        throw new Error("이메일과 인증 코드를 모두 입력해주세요.")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(cleanEmail)) {
        throw new Error("올바른 이메일 형식이 아닙니다.")
      }

      if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
        throw new Error("인증 코드는 6자리 숫자여야 합니다.")
      }

      const verifyData: VerifyCodeDto = { email: cleanEmail, code: cleanCode }
      const response = await apiClient.post<any>("/api/auth/verify-email", verifyData, false)

      console.log("📥 인증 코드 검증 성공 응답:", response)
      return response
    } catch (error: any) {
      console.error("❌ AuthService 인증 코드 검증 오류:", error)

      if (error.message?.includes("400")) {
        throw new Error("인증 코드가 올바르지 않습니다.")
      } else if (error.message?.includes("404")) {
        throw new Error("해당 이메일로 발송된 인증 코드를 찾을 수 없습니다.")
      } else if (error.message?.includes("409")) {
        throw new Error("이미 인증이 완료된 이메일입니다.")
      }

      throw error
    }
  }

  // 임시 비밀번호 발급
  async resetPassword(email: string): Promise<ApiResponse<LoginResponseDto>> {
    return apiClient.post<LoginResponseDto>("/api/auth/reset-password", email.trim(), false)
  }

  // Access Token 재발급
  async reissueToken(refreshToken: string): Promise<ApiResponse<LoginResponseDto>> {
    const reissueData: ReissueRequestDto = { refreshToken }
    const response = await apiClient.post<LoginResponseDto>("/api/auth/reissue-token", reissueData, false)

    if (response.data) {
      this.saveTokens(response.data)
    }

    return response
  }

  // 사용자 정보 가져오기 및 저장
  async fetchAndSaveUserInfo(): Promise<void> {
    try {
      console.log("👤 사용자 정보 가져오는 중...")

      // 임시 사용자 객체 생성 (API 호출을 위해)
      const tempUser = this.getCurrentUser() || {
        id: 0,
        email: "",
        nickname: "임시사용자",
        role: "ROLE_USER" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const response = await apiClient.get<any>(`/api/user/mypage?user=${encodeURIComponent(JSON.stringify(tempUser))}`)

      if (response.data) {
        const userInfo: User = {
          id: response.data.id || tempUser.id,
          email: response.data.email || tempUser.email,
          nickname: response.data.nickname || tempUser.nickname,
          profileImage: response.data.profileImage,
          role: "ROLE_USER",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        console.log("💾 사용자 정보 저장:", userInfo)
        this.saveUser(userInfo)
      }
    } catch (error) {
      console.error("❌ 사용자 정보 가져오기 실패:", error)

      // 기본 사용자 정보 생성
      const token = this.getAccessToken()
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]))
          const basicUserInfo: User = {
            id: payload.sub || Date.now(),
            email: payload.email || "",
            nickname: payload.nickname || "사용자",
            role: "ROLE_USER",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          console.log("🔧 기본 사용자 정보 생성:", basicUserInfo)
          this.saveUser(basicUserInfo)
        } catch (tokenError) {
          console.error("❌ 토큰 디코딩 실패:", tokenError)

          const fallbackUser: User = {
            id: Date.now(),
            email: "",
            nickname: "사용자",
            role: "ROLE_USER",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          console.log("🆘 최소 사용자 정보 생성:", fallbackUser)
          this.saveUser(fallbackUser)
        }
      }
    }
  }

  // 토큰 관리 메서드들
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
  }

  getAccessTokenExpiration(): number | null {
    if (typeof window === "undefined") return null
    const expiration = localStorage.getItem("accessTokenExpiration")
    return expiration ? Number.parseInt(expiration) : null
  }

  saveTokens(loginResponse: LoginResponseDto): void {
    console.log("💾 토큰 저장 중:", loginResponse)
    if (typeof window !== "undefined") {
      const currentTime = Date.now()
      const accessTokenExpiration = currentTime + loginResponse.accessTokenExpirationTime
      const refreshTokenExpiration = currentTime + loginResponse.refreshTokenExpirationTime

      localStorage.setItem("accessToken", loginResponse.accessToken)
      localStorage.setItem("refreshToken", loginResponse.refreshToken)
      localStorage.setItem("accessTokenExpiration", accessTokenExpiration.toString())
      localStorage.setItem("refreshTokenExpiration", refreshTokenExpiration.toString())

      console.log("✅ 토큰 저장 완료")
    }
  }

  clearTokens(): void {
    console.log("🧹 토큰 정리 중...")
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("accessTokenExpiration")
      localStorage.removeItem("refreshTokenExpiration")
      localStorage.removeItem("user")
      console.log("✅ 토큰 정리 완료")
    }
  }

  isTokenValid(): boolean {
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

  isRefreshTokenValid(): boolean {
    if (typeof window === "undefined") return false

    const refreshToken = localStorage.getItem("refreshToken")
    const expiration = localStorage.getItem("refreshTokenExpiration")

    if (!refreshToken || !expiration) {
      return false
    }

    const currentTime = Date.now()
    const expirationTime = Number.parseInt(expiration)
    return currentTime < expirationTime
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("user")
    const user = userStr ? JSON.parse(userStr) : null

    console.log("👤 현재 사용자 정보:", user)
    return user
  }

  saveUser(user: User): void {
    if (typeof window !== "undefined") {
      console.log("💾 사용자 정보 저장:", user)
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  isAuthenticated(): boolean {
    const hasValidToken = this.isTokenValid()
    const hasUser = !!this.getCurrentUser()

    console.log("🔐 인증 상태 확인:")
    console.log("- 유효한 토큰:", hasValidToken)
    console.log("- 사용자 정보:", hasUser)

    return hasValidToken && hasUser
  }

  logout(): void {
    console.log("👋 로그아웃 중...")
    this.clearTokens()
  }
}

export const authService = new AuthService()

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { apiClient } from "@/lib/api-client"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMockMode, setIsMockMode] = useState(false)
  const [testAccounts, setTestAccounts] = useState<any[]>([])
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    const mockMode = apiClient.isUsingMockApi()
    setIsMockMode(mockMode)
    if (mockMode) {
      setTestAccounts(apiClient.getTestAccounts())
    }
  }, [])

  // 이메일 도메인 자동 완성 제안
  const getEmailSuggestions = (email: string) => {
    const commonDomains = ["gmail.com", "naver.com", "daum.net", "kakao.com", "yahoo.com"]
    const [localPart, domain] = email.split("@")

    if (!domain || domain.length < 2) return []

    return commonDomains
      .filter(
        (commonDomain) =>
          commonDomain.toLowerCase().includes(domain.toLowerCase()) ||
          domain.toLowerCase().includes(commonDomain.toLowerCase().substring(0, 3)),
      )
      .map((commonDomain) => `${localPart}@${commonDomain}`)
  }

  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([])

  const handleEmailChange = (value: string) => {
    setEmail(value)

    // 이메일 제안 생성
    if (value.includes("@") && !value.endsWith("@")) {
      const suggestions = getEmailSuggestions(value)
      setEmailSuggestions(suggestions.slice(0, 3)) // 최대 3개 제안
    } else {
      setEmailSuggestions([])
    }
  }

  const handleTestAccountClick = (account: any) => {
    setEmail(account.email)
    setPassword(account.password)
    setEmailSuggestions([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailSuggestions([]) // 제안 숨기기

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.")
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return
    }

    // 일반적인 이메일 도메인 오타 체크
    const commonTypos = {
      "gmaill.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gmai.com": "gmail.com",
      "navr.com": "naver.com",
      "nver.com": "naver.com",
      "daum.ent": "daum.net",
      "kakoa.com": "kakao.com",
    }

    const emailDomain = email.split("@")[1]?.toLowerCase()
    if (emailDomain && commonTypos[emailDomain as keyof typeof commonTypos]) {
      const suggestedEmail = email.replace(emailDomain, commonTypos[emailDomain as keyof typeof commonTypos])
      setError(`이메일 주소를 확인해주세요. 혹시 "${suggestedEmail}"을(를) 의도하셨나요?`)
      return
    }

    try {
      setIsLoading(true)
      console.log("🔑 로그인 시도:", { email, passwordLength: password.length })

      const success = await login(email, password)

      if (success) {
        console.log("✅ 로그인 성공, 홈으로 이동")
        router.push("/")
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error: any) {
      console.error("❌ 로그인 오류:", error)

      // 서버 에러 메시지에 따른 사용자 친화적 메시지
      let errorMessage = "로그인에 실패했습니다."

      if (error.message.includes("네트워크 연결 오류")) {
        errorMessage = isMockMode
          ? "Mock API 모드에서 오류가 발생했습니다. 테스트 계정을 사용해주세요."
          : "⚠️ 현재 v0 환경에서는 외부 API 연결이 제한됩니다.\n\n로컬 환경에서 테스트하려면:\n1. 코드를 다운로드하세요\n2. localhost:3000에서 실행하세요\n3. 백엔드 서버가 실행 중인지 확인하세요"
      } else if (error.message.includes("이메일 또는 비밀번호가 일치하지 않습니다")) {
        errorMessage = isMockMode
          ? "테스트 계정 정보를 확인해주세요. 아래 테스트 계정을 사용하세요."
          : "이메일 또는 비밀번호가 일치하지 않습니다."
      } else if (error.message.includes("401")) {
        errorMessage = "이메일 또는 비밀번호를 확인해주세요."
      } else if (error.message.includes("500")) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      } else if (error.message.includes("CORS")) {
        errorMessage =
          "⚠️ CORS 오류가 발생했습니다.\n\n해결 방법:\n1. 백엔드에서 현재 도메인을 허용 목록에 추가\n2. 또는 localhost:3000에서 테스트"
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    console.log("비밀번호 찾기 클릭")
  }

  const handleFindId = () => {
    console.log("아이디 찾기 클릭")
  }

  return (
    <div className="space-y-6">
      {/* Mock API 모드 안내 */}
      {isMockMode && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">🎭 Mock API 모드로 실행 중</p>
              <p className="mt-1 text-xs">
                v0 환경에서 테스트할 수 있도록 Mock 데이터를 사용합니다. 아래 테스트 계정을 사용해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 테스트 계정 목록 */}
      {isMockMode && testAccounts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3">🧪 테스트 계정</h3>
          <div className="space-y-2">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTestAccountClick(account)}
                className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{account.nickname}</p>
                    <p className="text-xs text-blue-600">{account.email}</p>
                  </div>
                  <div className="text-xs text-blue-500">클릭하여 자동 입력</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium whitespace-pre-line">{error}</p>
              {error.includes("이메일 또는 비밀번호가 일치하지 않습니다") && !isMockMode && (
                <div className="text-xs mt-2 text-red-600 space-y-1">
                  <p>다음 사항을 확인해주세요:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>이메일 주소 철자 (특히 도메인 부분)</li>
                    <li>비밀번호 대소문자</li>
                    <li>회원가입 완료 여부</li>
                    <li>인증된 이메일로 가입했는지 여부</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            이메일
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value.trim())}
            placeholder="이메일 주소를 입력하세요"
            disabled={isLoading}
            autoComplete="email"
          />

          {/* 이메일 제안 드롭다운 */}
          {emailSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {emailSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    setEmail(suggestion)
                    setEmailSuggestions([])
                  }}
                >
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
              로그인 상태 유지
            </label>
          </div>
          <div className="flex space-x-4 text-sm">
            <button type="button" className="text-gray-600 hover:text-gray-800 hover:underline" onClick={handleFindId}>
              아이디 찾기
            </button>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 hover:underline"
              onClick={handleForgotPassword}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isMockMode ? "Mock 로그인 중..." : "로그인 중..."}
            </>
          ) : (
            "로그인"
          )}
        </button>
      </form>

      {/* 회원가입 안내 */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          아직 계정이 없으신가요?{" "}
          <button
            type="button"
            className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
            onClick={() => {
              const signupTab = document.querySelector('[data-tab="signup"]') as HTMLButtonElement
              if (signupTab) {
                signupTab.click()
              }
            }}
          >
            회원가입하기
          </button>
        </p>
      </div>
    </div>
  )
}

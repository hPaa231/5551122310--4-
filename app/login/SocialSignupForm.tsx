"use client"

import { useState } from "react"
import { MessageCircle, Search } from "lucide-react"

export default function SocialSignupForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleKakaoSignup = async () => {
    setIsLoading(true)
    try {
      // 카카오 OAuth 로직 구현
      console.log("카카오 회원가입 시도")
      alert("카카오 회원가입 기능은 준비 중입니다.")
    } catch (error) {
      console.error("카카오 회원가입 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      // 구글 OAuth 로직 구현
      console.log("구글 회원가입 시도")
      alert("구글 회원가입 기능은 준비 중입니다.")
    } catch (error) {
      console.error("구글 회원가입 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <img src="/jegomi.png" alt="제곰이" className="w-16 h-16 object-contain mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">소셜 회원가입</h2>
        <p className="text-gray-600 text-sm mt-2">간편하게 가입하고 시작하세요</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleKakaoSignup}
          disabled={isLoading}
          className="w-full py-3 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {isLoading ? "처리 중..." : "카카오로 가입하기"}
        </button>

        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Search className="w-5 h-5 mr-2" />
          {isLoading ? "처리 중..." : "구글로 가입하기"}
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>소셜 로그인으로 가입하면</p>
        <p>
          <span className="text-orange-600">이용약관</span> 및 <span className="text-orange-600">개인정보처리방침</span>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 px-1 text-center font-medium text-lg transition-colors ${
              activeTab === "login"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 px-1 text-center font-medium text-lg transition-colors ${
              activeTab === "signup"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 제곰이 로고 */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-2xl">🐻</span>
          </div>
        </div>

        {/* 폼 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {activeTab === "login" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  )
}

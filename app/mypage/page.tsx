"use client"

import { useAuth } from "@/context/AuthContext"
import MyPage from "./MyPage"

export default function Page() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  // 렌더링 시점에서의 상태 확인 로그
  console.log("🎨 마이페이지 렌더링 상태:", {
    authLoading,
    isAuthenticated,
    user: user ? { id: user.id, email: user.email, nickname: user.nickname } : null,
    hasToken: typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,
  })

  // 로딩 중
  if (authLoading) {
    console.log("🔄 로딩 화면 렌더링")
    return (
      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#785549] mx-auto mb-4"></div>
            <p className="text-gray-600">인증 상태 확인 중...</p>
          </div>
        </div>
      </div>
    )
  }

  // 토큰이 있으면 무조건 MyPage 컴포넌트 렌더링 (가장 관대한 접근)
  const hasToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  if (hasToken) {
    console.log("✅ 토큰 있음 - 마이페이지 컴포넌트 렌더링")
    return <MyPage />
  }

  // 토큰이 없을 때만 로그인 요구
  console.log("❌ 토큰 없음 - 로그인 필요")
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-[#785549] hover:bg-[#5d4037] text-white px-4 py-2 rounded-lg"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  )
}

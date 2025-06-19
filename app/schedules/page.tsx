"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin, Plus, Clock, ChevronRight, Search, ArrowLeft, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function SchedulesPage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // 임시로 로그인 상태 설정
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [currentTab, setCurrentTab] = useState("upcoming")

  return (
    <div className="min-h-screen bg-white">
      {/* 새로운 헤더 디자인 */}
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">재곰제곰</span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:bg-black/30 transition-colors"
                  onClick={() => setShowLoginModal(true)}
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="프로필"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">김재곤</span>
                </button>
              </div>
            ) : (
              <Button variant="outline" className="font-medium text-white border-white/20 hover:bg-white/10">
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>홈으로 돌아가기</span>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-2">내 여행 일정</h1>
          <p className="text-gray-600">제주도 여행 일정을 관리하고 새로운 여행을 계획해보세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12 border border-gray-100">
          <div className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-black">새로운 여행 계획</h2>
              <p className="text-gray-600 mt-1">새로운 제주도 여행을 계획해보세요</p>
            </div>
            <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6">
              <Plus className="mr-2 h-4 w-4" /> 새 일정 만들기
            </Button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                <CalendarDays className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-bold text-lg mb-2">날짜 선택</h3>
              <p className="text-gray-600 text-sm mb-6">여행 일정을 선택하고 계획을 시작하세요</p>
              <Link href="/planning/flow/date-selection" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                >
                  시작하기
                </Button>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-bold text-lg mb-2">추천 코스</h3>
              <p className="text-gray-600 text-sm mb-6">인기 있는 제주도 여행 코스를 확인하세요</p>
              <Link href="/planning/recommended" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                >
                  코스 보기
                </Button>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-black"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M13 17.8a6 6 0 1 1-7.3-9.6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">AI 추천</h3>
              <p className="text-gray-600 text-sm mb-6">AI가 당신에게 맞는 여행 코스를 추천해드려요</p>
              <Link href="/planning/ai" className="w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                >
                  AI 추천받기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <Tabs defaultValue="upcoming" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="bg-white border p-1 rounded-full">
              <TabsTrigger
                value="upcoming"
                className="px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-full"
              >
                다가오는 여행
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-full"
              >
                지난 여행
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-full"
              >
                저장된 계획
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="여행 일정 검색..."
                  className="pl-10 pr-4 py-2 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="upcoming" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Trip Card 1 */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="제주도 여름 휴가"
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                      D-35
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-black">제주도 여름 휴가 ✨</h3>
                        <div className="flex items-center mt-2 text-gray-600">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">2024-07-15 - 2024-07-19</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">제주시, 서귀포시</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">5일 일정</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/schedules/1"
                        className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
                      >
                        자세히 보기
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                      >
                        수정하기
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Trip Card 2 */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="설악산 단풍 여행"
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                      D-193
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-black">설악산 단풍 여행 🍁</h3>
                        <div className="flex items-center mt-2 text-gray-600">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">2024-10-20 - 2024-10-22</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">속초시, 양양군</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">3일 일정</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/schedules/2"
                        className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
                      >
                        자세히 보기
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                      >
                        수정하기
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Add New Trip Card */}
                <div className="border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 h-full bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-black" />
                  </div>
                  <p className="text-black font-medium text-lg">새 여행 일정 만들기</p>
                  <p className="text-gray-500 text-sm mt-2 text-center">
                    새로운 여행 계획을 세우고
                    <br />
                    일정을 관리해보세요
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Past Trip Card 1 */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="부산 여행"
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                      완료됨
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-black">부산 여행 🌊</h3>
                        <div className="flex items-center mt-2 text-gray-600">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">2024-03-10 - 2024-03-12</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">해운대, 광안리</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/schedules/3"
                        className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
                      >
                        자세히 보기
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                      >
                        리뷰 작성
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Past Trip Card 2 */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="강원도 스키 여행"
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                      완료됨
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-black">강원도 스키 여행 ⛷️</h3>
                        <div className="flex items-center mt-2 text-gray-600">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">2024-01-15 - 2024-01-17</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">평창, 용평리조트</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/schedules/4"
                        className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
                      >
                        자세히 보기
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                      >
                        리뷰 작성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Saved Trip Card */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="도쿄 여행 계획"
                      width={400}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                      저장됨
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-black">도쿄 여행 계획 🗼</h3>
                        <div className="flex items-center mt-2 text-gray-600">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="text-sm">날짜 미정</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">시부야, 신주쿠, 아사쿠사</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/schedules/5"
                        className="text-black hover:text-gray-700 text-sm font-medium flex items-center"
                      >
                        자세히 보기
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-black"
                      >
                        수정하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">계정</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex border-b mb-6">
              <button
                className={`flex-1 py-3 text-center ${
                  activeTab === "login" ? "border-b-2 border-black font-medium" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("login")}
              >
                로그인
              </button>
              <button
                className={`flex-1 py-3 text-center ${
                  activeTab === "signup" ? "border-b-2 border-black font-medium" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                회원가입
              </button>
            </div>

            {/* 로그인 폼 */}
            {activeTab === "login" && (
              <div>
                <form className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">이메일</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="이메일 주소를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">비밀번호</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input type="checkbox" id="remember" className="mr-2" />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        로그인 상태 유지
                      </label>
                    </div>
                    <a href="#" className="text-sm text-gray-600 hover:underline">
                      비밀번호 찾기
                    </a>
                  </div>
                  <Button
                    type="button"
                    className="w-full py-3 bg-black hover:bg-gray-800 rounded-lg"
                    onClick={() => {
                      setIsLoggedIn(true)
                      setShowLoginModal(false)
                    }}
                  >
                    로그인
                  </Button>
                </form>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-3 border border-[#FEE500] bg-[#FEE500] rounded-lg font-medium flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="카카오 로고"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    카카오로 로그인
                  </button>
                  <button className="w-full py-3 border border-gray-300 rounded-lg font-medium flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="구글 로고"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    구글로 로그인
                  </button>
                </div>
              </div>
            )}

            {/* 회원가입 폼 */}
            {activeTab === "signup" && (
              <div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">이메일</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="abc@naver.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">비밀번호</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="8자 이상"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
                    <input
                      type="password"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="위 비밀번호와 동일하게 입력"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">닉네임</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="닉네임 입력"
                    />
                  </div>
                  <Button type="button" className="w-full py-3 bg-black hover:bg-gray-800 rounded-lg">
                    회원가입
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

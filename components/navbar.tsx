"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search, User, Calendar, LogOut, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [query, setQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return path === "/" ? pathname === path : pathname.startsWith(path)
  }

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  console.log("🔍 Navbar 인증 상태:", { loading, isAuthenticated, user: user?.email })

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-black">
            재곰제곰
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: "/attractions", label: "관광지" },
              { href: "/accommodations", label: "숙소" },
              { href: "/restaurants", label: "맛집" },
              { href: "/flights", label: "항공권" },
              { href: "/community", label: "커뮤니티" },
              { href: "/planning", label: "여행 계획" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  isActive(href) ? "text-[#785549] border-b-2 border-[#785549] pb-1" : "text-gray-600 hover:text-black"
                }`}
                style={isActive(href) ? { borderColor: "#785549" } : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center gap-4">
            {/* 데스크탑 검색 바 */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative w-64">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="여행지, 숙소, 맛집 검색..."
                className="pl-10 pr-20 py-2 w-full bg-gray-100 border-0 rounded-full text-sm text-black focus:ring-1 focus:ring-black focus:bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-orange-500 hover:underline"
              >
                검색
              </button>
            </form>

            <button className="md:hidden p-2 rounded-full hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>

            {/* 로그인/프로필 영역 */}
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#785549] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.nickname?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm hidden md:block">{user?.nickname || "사용자"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push("/mypage")}>
                    <User className="w-4 h-4 mr-2" />
                    마이페이지
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/schedules")}>
                    <Calendar className="w-4 h-4 mr-2" />내 일정
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/login")} className="bg-[#785549] hover:bg-[#5d4037] text-white">
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/" className="text-xl font-bold text-black">
              재곰제곰
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="여행지, 숙소, 맛집 검색..."
                className="pl-10 pr-20 py-2 w-full bg-gray-100 border-0 rounded-full text-sm text-black focus:ring-1 focus:ring-black focus:bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-orange-500 hover:underline"
              >
                검색
              </button>
            </form>
          </div>

          <nav className="flex flex-col p-4">
            {[
              { href: "/attractions", label: "관광지" },
              { href: "/accommodations", label: "숙소" },
              { href: "/restaurants", label: "맛집" },
              { href: "/flights", label: "항공권" },
              { href: "/community", label: "커뮤니티" },
              { href: "/planning", label: "여행 계획" },
              { href: "/mypage", label: "마이페이지" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg text-sm font-medium ${
                  isActive(href) ? "bg-gray-100 text-[#785549]" : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* 모바일 로그인/프로필 영역 */}
          <div className="px-4 py-2 border-t">
            {loading ? (
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-10 h-10 bg-[#785549] rounded-full flex items-center justify-center text-white font-medium">
                    {user?.nickname?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{user?.nickname || "사용자"}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/mypage")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  마이페이지
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push("/schedules")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />내 일정
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  router.push("/login")
                  setIsMobileMenuOpen(false)
                }}
                className="w-full bg-[#785549] hover:bg-[#5d4037] text-white"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

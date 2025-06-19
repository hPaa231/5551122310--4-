"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Wifi, Car, Coffee, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { accommodationService } from "@/lib/accommodation-service"

// API 응답에 맞는 타입 정의
interface AccommodationData {
  id: string
  name: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  [key: string]: any // 추가 속성들을 위한 인덱스 시그니처
}

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<AccommodationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API에서 데이터 로드 (필터링 없이)
  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🚀 숙소 데이터 로딩 시작...")

        // 기본값으로 API 호출
        const data = await accommodationService.searchPlaces("제주", "2024-01-01", "2024-01-02", 2)

        console.log("📋 받아온 숙소 데이터:", data)
        console.log("📊 숙소 개수:", data.length)

        setAccommodations(data)
      } catch (error) {
        console.error("❌ 숙소 데이터 로드 실패:", error)
        setError("숙소 데이터를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    loadAccommodations()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-lg">숙소 데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/placeholder.svg?height=32&width=32" alt="로고" className="w-8 h-8" />
          <div className="text-2xl font-bold">제주도 숙소</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded-md px-3 py-2">
            <Search size={20} className="text-gray-500" />
            <input type="text" placeholder="숙소명, 지역으로 검색" className="ml-2 border-none outline-none" />
          </div>
        </div>
      </div>

      {/* 숙소 개수 표시 */}
      <div className="py-4">
        <div className="text-lg font-semibold text-gray-800">총 {accommodations.length}개의 숙소</div>
      </div>

      {/* 숙소 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {accommodations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">숙소 데이터가 없습니다.</div>
            </div>
          ) : (
            accommodations.map((accommodation, index) => (
              <Link
                href={`/accommodations/${accommodation.id}`}
                key={accommodation.id || index}
                className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 relative">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={accommodation.imageUrl || "/placeholder.svg?height=300&width=400"}
                        alt={accommodation.name || "숙소 이미지"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=300&width=400"
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-black">
                        추천
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-2/3 p-5">
                    <h3 className="font-bold text-lg text-gray-900">{accommodation.name || "숙소명 없음"}</h3>

                    <div className="flex items-center mt-2 text-sm">
                      <div className="flex text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 font-medium">4.5</span>
                      </div>
                      <span className="text-gray-500 ml-1">(리뷰 수)</span>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span>
                        {accommodation.latitude && accommodation.longitude
                          ? `위도: ${accommodation.latitude}, 경도: ${accommodation.longitude}`
                          : "위치 정보 없음"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-gray-100 text-xs px-3 py-1.5 rounded-full flex items-center">
                        <Wifi size={12} className="mr-1.5" />
                        무료 와이파이
                      </span>
                      <span className="bg-gray-100 text-xs px-3 py-1.5 rounded-full flex items-center">
                        <Car size={12} className="mr-1.5" />
                        주차장
                      </span>
                      <span className="bg-gray-100 text-xs px-3 py-1.5 rounded-full flex items-center">
                        <Coffee size={12} className="mr-1.5" />
                        레스토랑
                      </span>
                    </div>

                    <div className="mt-4 flex justify-between items-end">
                      <div className="text-xs text-gray-500">1박 기준</div>
                      <div>
                        <span className="text-2xl font-bold text-gray-900">가격 문의</span>
                      </div>
                    </div>

                    {/* 디버깅용: 실제 데이터 구조 표시 */}
                    <details className="mt-2">
                      <summary className="text-xs text-gray-400 cursor-pointer">데이터 구조 보기</summary>
                      <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(accommodation, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* 지도 영역 */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm border">
            <div className="h-[calc(100vh-150px)] flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-2xl text-gray-400 font-bold mb-2">지도</div>
                <div className="text-sm text-gray-500">숙소 위치를 지도에서 확인하세요</div>
                <div className="text-xs text-gray-400 mt-2">총 {accommodations.length}개 숙소</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

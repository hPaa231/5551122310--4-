"use client"

import Image from "next/image"
import Link from "next/link"
import { restaurants } from "@/data/restaurants"
import { Filter, MapPin, Star, Search, Clock, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function RestaurantsPage() {
  const [activeLocationTags, setActiveLocationTags] = useState<string[]>([])
  const [activeFeatureTags, setActiveFeatureTags] = useState<string[]>([])

  const locationTags = [
    "제주시내",
    "애월",
    "한림",
    "한경",
    "조천",
    "구좌",
    "우도",
    "추자",
    "서귀포시",
    "성산",
    "서귀포시내",
    "대정",
    "안덕",
    "중문",
    "남원",
    "표선",
  ]

  const featureTags = [
    "전체",
    "맛있는제주만들기",
    "착한가격업소",
    "럭셔리트래블인제주",
    "우수관광사업체",
    "무장애관광",
    "향토음식",
    "한식",
    "카페",
    "해물뚝배기",
    "몸국",
    "해장국",
    "흑돼지",
    "수제버거",
    "해산물",
  ]

  const handleLocationTagClick = (tag: string) => {
    setActiveLocationTags((prevTags) => 
      prevTags.includes(tag) ? prevTags.filter((item) => item !== tag) : [...prevTags, tag]
    )
  }

  const handleFeatureTagClick = (tag: string) => {
    setActiveFeatureTags((prevTags) => 
      prevTags.includes(tag) ? prevTags.filter((item) => item !== tag) : [...prevTags, tag]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/images/logo.png" // 이미지 경로를 알맞게 수정
            alt="로고"
            className="w-8 h-8" // 크기를 조정 (작게)
          />
          <div className="text-2xl font-bold">제주도 맛집</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border rounded-md px-3 py-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="맛집명, 메뉴, 지역으로 검색"
              className="ml-2 border-none outline-none"
            />
          </div>
          <button className="text-black">필터</button>
        </div>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="맛집명, 메뉴, 지역으로 검색"
            className="pl-10 w-full py-3 border-gray-300 rounded-lg focus:ring-black focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button className="flex items-center px-4 py-2 bg-[#FF6F00] text-white rounded-full text-sm font-medium">
            <Filter size={16} className="mr-2" />
            필터
          </button>
          <div className="text-sm font-medium text-gray-700">해시태그</div>
        </div>

        {/* 지역별 해시태그 */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">지역별</h3>
            <ChevronRight size={16} className="ml-1 text-gray-400" />
          </div>
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {locationTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleLocationTagClick(tag)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeLocationTags.includes(tag) ? "bg-[#FF8F00] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 특성별 해시태그 */}
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">특성별</h3>
            <ChevronRight size={16} className="ml-1 text-gray-400" />
          </div>
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {featureTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleFeatureTagClick(tag)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFeatureTags.includes(tag) ? "bg-[#FFB74D] text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 선택된 필터 표시 */}
      {(activeLocationTags.length > 0 || activeFeatureTags.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeLocationTags.map((tag) => (
            <div key={tag} className="bg-[#FF8F00] text-white px-3 py-1.5 rounded-full text-sm flex items-center">
              #{tag}
              <button onClick={() => setActiveLocationTags(activeLocationTags.filter((item) => item !== tag))} className="ml-2 hover:text-gray-200">
                ×
              </button>
            </div>
          ))}
          {activeFeatureTags.map((tag) => (
            <div key={tag} className="bg-[#FFB74D] text-white px-3 py-1.5 rounded-full text-sm flex items-center">
              #{tag}
              <button onClick={() => setActiveFeatureTags(activeFeatureTags.filter((item) => item !== tag))} className="ml-2 hover:text-gray-200">
                ×
              </button>
            </div>
          ))}
          {(activeLocationTags.length > 0 || activeFeatureTags.length > 0) && (
            <button
              onClick={() => {
                setActiveLocationTags([])
                setActiveFeatureTags([])
              }}
              className="text-sm text-gray-600 underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 맛집 목록 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="text-sm text-gray-500 mb-4">{restaurants.length}개의 맛집</div>

          {restaurants.map((restaurant) => (
            <Link
              href={`/restaurants/${restaurant.id}`}
              key={restaurant.id}
              className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 relative">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={restaurant.image || "/placeholder.svg?height=300&width=400"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-black">
                      인기
                    </div>
                  </div>
                </div>
                <div className="sm:w-2/3 p-5">
                  <h3 className="font-bold text-lg text-gray-900">{restaurant.name}</h3>
                  <div className="flex items-center mt-2 text-sm">
                    <div className="flex text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="text-gray-500 ml-1">({restaurant.reviewCount})</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium">
                      {restaurant.category}
                    </span>
                    <div className="ml-3 flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      {restaurant.hours}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <div className="text-sm font-medium">가격대</div>
                    <div className="text-lg font-bold text-gray-900">{restaurant.price}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 지도 영역 */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm border">
            <div className="h-[calc(100vh-150px)] flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-2xl text-gray-400 font-bold mb-2">지도</div>
                <div className="text-sm text-gray-500">맛집 위치를 지도에서 확인하세요</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

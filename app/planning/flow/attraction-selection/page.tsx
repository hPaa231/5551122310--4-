"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, ChevronLeft, Heart, Trash } from "lucide-react"
import { attractionService } from "@/lib/attraction-service"
import { tripService } from "@/lib/trip-service"
import { authService } from "@/lib/auth-service"

interface SelectedPlace {
  place: any
  dayNumber: number
  sequence: number
}

export default function AttractionSelectionPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [attractions, setAttractions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([])
  const [activeTab, setActiveTab] = useState("관광지")
  const [activeRegion, setActiveRegion] = useState("전체")
  const [activeCategory, setActiveCategory] = useState("전체")
  const [tripStartDate, setTripStartDate] = useState("")
  const [tripEndDate, setTripEndDate] = useState("")
  const [tripDays, setTripDays] = useState(1)
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentTripPlan, setCurrentTripPlan] = useState<any>(null)
  const [tripDayIds, setTripDayIds] = useState<number[]>([])

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const storedStartDate = localStorage.getItem("tripStartDate")
    const storedEndDate = localStorage.getItem("tripEndDate")
    const storedDays = localStorage.getItem("tripDays")
    const storedTripPlanId = localStorage.getItem("currentTripPlanId")

    if (storedStartDate) setTripStartDate(storedStartDate)
    if (storedEndDate) setTripEndDate(storedEndDate)
    if (storedDays) setTripDays(Number(storedDays))

    // 인증 확인
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }

    // 여행 계획 정보 로드
    if (storedTripPlanId) {
      loadTripPlan(Number(storedTripPlanId))
    }

    // 관광지 데이터 로드
    loadAttractions()
  }, [])

  const loadTripPlan = async (planId: number) => {
    try {
      const planResponse = await tripService.getTripPlan(planId)
      if (planResponse.data) {
        setCurrentTripPlan(planResponse.data)

        // 여행 일정 생성
        await createTripDays(planId)
      }
    } catch (error) {
      console.error("❌ 여행 계획 로드 실패:", error)
    }
  }

  const createTripDays = async (planId: number) => {
    try {
      const dayIds: number[] = []

      for (let i = 0; i < tripDays; i++) {
        const date = new Date(tripStartDate)
        date.setDate(date.getDate() + i)
        const dateString = date.toISOString().split("T")[0]

        const dayResponse = await tripService.addTripDay(planId, dateString)
        if (dayResponse.data) {
          dayIds.push(dayResponse.data.tripDayId)
        }
      }

      setTripDayIds(dayIds)
      console.log("✅ 여행 일정 생성 완료:", dayIds)
    } catch (error) {
      console.error("❌ 여행 일정 생성 실패:", error)
    }
  }

  const loadAttractions = async () => {
    setLoading(true)
    try {
      const data = await attractionService.getAttractions()
      setAttractions(data)
    } catch (error) {
      console.error("❌ 관광지 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceSelect = (place: any) => {
    console.log("🎯 장소 선택됨:", place.name, place.id)

    const isSelected = selectedPlaces.some((sp) => sp.place.id === place.id)
    console.log("🔍 이미 선택됨:", isSelected)

    if (isSelected) {
      setSelectedPlaces((prev) => {
        const updated = prev.filter((sp) => sp.place.id !== place.id)
        console.log("➖ 장소 제거 후:", updated.length, "개")
        return updated
      })
    } else {
      const newPlace: SelectedPlace = {
        place,
        dayNumber: 1,
        sequence: selectedPlaces.filter((sp) => sp.dayNumber === 1).length + 1,
      }
      setSelectedPlaces((prev) => {
        const updated = [...prev, newPlace]
        console.log("➕ 장소 추가 후:", updated.length, "개")
        return updated
      })
    }
  }

  const changePlaceDay = (placeId: string, newDay: number) => {
    console.log("📅 일자 변경:", placeId, "->", newDay, "일차")
    setSelectedPlaces((prev) =>
      prev.map((sp) => {
        if (sp.place.id === placeId) {
          const newSequence = selectedPlaces.filter((p) => p.dayNumber === newDay).length + 1
          return { ...sp, dayNumber: newDay, sequence: newSequence }
        }
        return sp
      }),
    )
  }

  const handleContinue = async () => {
    if (selectedPlaces.length === 0) {
      alert("최소 하나의 장소를 선택해주세요.")
      return
    }

    console.log("🚀 다음 단계로 이동, 선택된 장소:", selectedPlaces.length, "개")

    try {
      // 선택된 장소들을 로컬 스토리지에 저장 (일정 확정 페이지에서 사용)
      localStorage.setItem("selectedPlaces", JSON.stringify(selectedPlaces))
      localStorage.setItem("selectedPlacesData", JSON.stringify(selectedPlaces.map((sp) => sp.place)))

      // 선택된 장소들을 API에 저장
      for (const selectedPlace of selectedPlaces) {
        const dayId = tripDayIds[selectedPlace.dayNumber - 1]
        if (dayId) {
          console.log("💾 목적지 저장:", selectedPlace.place.name, "->", dayId)
          await tripService.addDestination(
            dayId,
            selectedPlace.sequence,
            selectedPlace.place.id, // contentsId 대신 id 사용
            "TOURIST",
            60, // 기본 60분 체류
            "CAR", // 기본 자동차 이동
          )
        }
      }

      console.log("✅ 모든 목적지 저장 완료")
      router.push("/planning/flow/itinerary-confirmation")
    } catch (error) {
      console.error("❌ 목적지 저장 실패:", error)
      alert("목적지 저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const getDateForDay = (day: number) => {
    if (!tripStartDate) return ""
    const date = new Date(tripStartDate)
    date.setDate(date.getDate() + day - 1)
    return date.toISOString().split("T")[0]
  }

  const getDayOfWeek = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    return days[date.getDay()]
  }

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // 필터링된 관광지
  const getFilteredAttractions = () => {
    let filtered = attractions

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.introduction?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.address?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // 지역 필터
    if (activeRegion !== "전체") {
      filtered = filtered.filter((item) => item.address?.includes(activeRegion))
    }

    // 카테고리 필터
    if (activeCategory !== "전체") {
      filtered = filtered.filter((item) => item.category?.includes(activeCategory))
    }

    return filtered
  }

  const regions = ["전체", "제주시", "서귀포시", "애월", "한림", "성산", "표선", "중문"]
  const categories = ["전체", "자연", "문화", "테마파크", "해변", "오름"]

  const filteredAttractions = getFilteredAttractions()

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen flex">
      {/* 왼쪽 패널 - 관광지 선택 */}
      <div className="w-1/2 border-r">
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center">
          <Link href="/" className="mr-4">
            <div className="text-xl font-bold">재곰제곰</div>
          </Link>
          <div className="text-lg font-medium ml-4">여행 계획 세우기</div>
          <div className="ml-auto relative">
            <input
              type="text"
              placeholder="장소 검색..."
              className="pl-9 pr-4 py-2 border rounded-full text-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* 진행 단계 표시 */}
        <div className="bg-gray-50 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="text-xs mt-1 font-medium">날짜 선택</span>
              </div>
              <div className="flex-1 h-1 bg-black mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <span className="text-xs mt-1 font-medium">숙소 선택</span>
              </div>
              <div className="flex-1 h-1 bg-black mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-xs mt-1 font-medium">관광지/맛집</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">
                  4
                </div>
                <span className="text-xs mt-1">일정 확정</span>
              </div>
            </div>
          </div>
        </div>

        {/* 선택된 날짜 표시 */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="max-w-3xl mx-auto flex items-center">
            <Calendar className="text-black mr-2" size={20} />
            <span className="font-medium">
              {formatDate(tripStartDate)} - {formatDate(tripEndDate)} ({tripDays}일)
            </span>
          </div>
        </div>

        {/* 필터 옵션 */}
        <div className="p-4 border-b">
          <div className="mb-4">
            <h3 className="font-medium mb-2">지역</h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeRegion === region ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 관광지 목록 */}
        <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 400px)" }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">관광지를 불러오는 중...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredAttractions.map((place) => {
                const isSelected = selectedPlaces.some((sp) => sp.place.id === place.id)
                const selectedPlace = selectedPlaces.find((sp) => sp.place.id === place.id)

                return (
                  <div
                    key={place.id}
                    className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                      isSelected ? "border-2 border-black" : ""
                    }`}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <div className="relative h-40">
                      <Image
                        src={place.imageUrl || "/placeholder.svg?height=160&width=320"}
                        alt={place.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md"
                        onClick={(e) => toggleFavorite(place.id, e)}
                      >
                        <Heart
                          size={18}
                          className={favorites.includes(place.id) ? "fill-black text-black" : "text-gray-400"}
                        />
                      </button>
                      {isSelected && selectedPlace && (
                        <div className="absolute top-2 left-2 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {selectedPlace.dayNumber}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm">{place.name}</h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin size={12} className="mr-1" />
                        <span>{place.address}</span>
                      </div>
                      {place.category && (
                        <span className="inline-block bg-gray-100 text-xs px-2 py-0.5 rounded-full mt-2">
                          {place.category}
                        </span>
                      )}
                      {isSelected && selectedPlace && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">방문 일자:</span>
                            <div className="flex">
                              {Array.from({ length: tripDays }).map((_, index) => (
                                <button
                                  key={`day-${index}`}
                                  className={`w-6 h-6 rounded-full text-xs mx-0.5 ${
                                    selectedPlace.dayNumber === index + 1
                                      ? "bg-black text-white"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    changePlaceDay(place.id, index + 1)
                                  }}
                                >
                                  {index + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t flex justify-between">
          <Link href="/planning/flow/accommodation-selection" className="px-6 py-2 border rounded-md flex items-center">
            <ChevronLeft size={18} className="mr-1" />
            이전
          </Link>
          <button
            onClick={handleContinue}
            disabled={selectedPlaces.length === 0}
            className={`px-8 py-2 rounded-md ${
              selectedPlaces.length > 0
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            다음 단계로 ({selectedPlaces.length}개 선택됨)
          </button>
        </div>
      </div>

      {/* 중앙 패널 - 선택된 장소 목록 */}
      <div className="w-1/4 border-r">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-medium">선택된 장소 ({selectedPlaces.length}개)</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {Array.from({ length: tripDays }).map((_, dayIndex) => {
              const dayNumber = dayIndex + 1
              const placesForDay = selectedPlaces.filter((sp) => sp.dayNumber === dayNumber)
              const dayDate = getDateForDay(dayNumber)

              return (
                <div key={`day-${dayNumber}`} className="p-4 border-b">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold mr-2">
                      {dayNumber}
                    </div>
                    <h3 className="font-medium">
                      {formatDate(dayDate)} ({getDayOfWeek(dayDate)})
                    </h3>
                  </div>

                  {placesForDay.length === 0 ? (
                    <div className="ml-10 text-sm text-gray-500">아직 선택된 장소가 없습니다.</div>
                  ) : (
                    <div className="ml-10 space-y-2">
                      {placesForDay
                        .sort((a, b) => a.sequence - b.sequence)
                        .map((selectedPlace, index) => (
                          <div
                            key={`${selectedPlace.place.id}-${dayNumber}-${index}`}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 relative rounded overflow-hidden mr-2">
                                <Image
                                  src={selectedPlace.place.imageUrl || "/placeholder.svg?height=40&width=40"}
                                  alt={selectedPlace.place.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{selectedPlace.place.name}</p>
                                <p className="text-xs text-gray-500">{selectedPlace.place.address}</p>
                              </div>
                            </div>
                            <button
                              className="p-1 text-gray-400 hover:text-gray-700"
                              onClick={() => handlePlaceSelect(selectedPlace.place)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 - 지도 */}
      <div className="w-1/4">
        <div className="h-full bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl text-gray-400 font-bold mb-2">지도</div>
              <div className="text-sm text-gray-500">선택한 장소를 지도에서 확인하세요</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

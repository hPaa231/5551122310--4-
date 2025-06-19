"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, ChevronLeft, Heart, X } from "lucide-react"
import { accommodationService } from "@/lib/accommodation-service"
import { tripService } from "@/lib/trip-service"
import { authService } from "@/lib/auth-service"
import type { PlaceDto, RoomDto } from "@/types/api-types"

interface SelectedAccommodation {
  place: PlaceDto
  room: RoomDto
  checkInDate: string
  checkOutDate: string
}

export default function AccommodationSelectionPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [accommodations, setAccommodations] = useState<PlaceDto[]>([])
  const [loading, setLoading] = useState(false)
  const [activeRegion, setActiveRegion] = useState("제주시")
  const [tripStartDate, setTripStartDate] = useState("")
  const [tripEndDate, setTripEndDate] = useState("")
  const [tripNights, setTripNights] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null)
  const [availableRooms, setAvailableRooms] = useState<RoomDto[]>([])
  const [selectedAccommodations, setSelectedAccommodations] = useState<SelectedAccommodation[]>([])
  const [currentTripPlan, setCurrentTripPlan] = useState<any>(null)

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const storedStartDate = localStorage.getItem("tripStartDate")
    const storedEndDate = localStorage.getItem("tripEndDate")
    const storedNights = localStorage.getItem("tripNights")

    if (storedStartDate) setTripStartDate(storedStartDate)
    if (storedEndDate) setTripEndDate(storedEndDate)
    if (storedNights) setTripNights(storedNights)

    // 인증 확인
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }

    // 여행 계획 생성
    createTripPlan()
  }, [])

  useEffect(() => {
    if (tripStartDate && tripEndDate && activeRegion) {
      searchAccommodations()
    }
  }, [activeRegion, tripStartDate, tripEndDate])

  const createTripPlan = async () => {
    if (!tripStartDate || !tripEndDate) return

    try {
      const planName = `제주도 여행 ${formatDate(tripStartDate)} - ${formatDate(tripEndDate)}`
      const response = await tripService.createTripPlan(planName, tripStartDate, tripEndDate)

      if (response.data) {
        setCurrentTripPlan(response.data)
        localStorage.setItem("currentTripPlanId", response.data.tripPlanId.toString())
        console.log("✅ 여행 계획 생성 완료:", response.data)
      }
    } catch (error) {
      console.error("❌ 여행 계획 생성 실패:", error)
    }
  }

  const searchAccommodations = async () => {
    console.log("🔍 숙소 검색 시작:", { activeRegion, tripStartDate, tripEndDate })
    setLoading(true)

    try {
      const places = await accommodationService.searchPlaces(
        activeRegion,
        tripStartDate,
        tripEndDate,
        2, // 기본 2인
      )

      console.log("📋 받아온 숙소 데이터:", places)
      console.log("📊 숙소 개수:", places.length)

      setAccommodations(places)

      // 상태 업데이트 확인
      setTimeout(() => {
        console.log("🔄 상태 업데이트 후 accommodations:", accommodations.length)
      }, 100)
    } catch (error) {
      console.error("❌ 숙박 검색 실패:", error)
      setAccommodations([]) // 에러 시 빈 배열로 설정
    } finally {
      setLoading(false)
    }
  }

  const handleAccommodationClick = async (place: PlaceDto) => {
    console.log("🏨 숙소 클릭:", place.name)
    setSelectedPlace(place)
    setLoading(true)

    try {
      const rooms = await accommodationService.searchRooms(place.id, tripStartDate, tripEndDate, 2)
      setAvailableRooms(rooms)
      setShowDetailModal(true)
    } catch (error) {
      console.error("❌ 객실 검색 실패:", error)
      setAvailableRooms([])
      setShowDetailModal(true) // 에러가 있어도 모달은 열기
    } finally {
      setLoading(false)
    }
  }

  const handleAddAccommodation = (room: RoomDto, checkInDate: string, checkOutDate: string) => {
    if (selectedPlace) {
      const newAccommodation: SelectedAccommodation = {
        place: selectedPlace,
        room,
        checkInDate,
        checkOutDate,
      }
      setSelectedAccommodations([...selectedAccommodations, newAccommodation])
      setShowDetailModal(false)
    }
  }

  const removeAccommodation = (index: number) => {
    const updatedAccommodations = [...selectedAccommodations]
    updatedAccommodations.splice(index, 1)
    setSelectedAccommodations(updatedAccommodations)
  }

  const handleContinue = () => {
    if (selectedAccommodations.length > 0) {
      localStorage.setItem("selectedAccommodations", JSON.stringify(selectedAccommodations))
      router.push("/planning/flow/attraction-selection")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
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

  const regions = ["제주시", "서귀포시", "애월", "한림", "성산", "표선", "중문"]

  const filteredAccommodations = accommodations.filter((place) => {
    if (searchQuery) {
      return place.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  // 디버깅용 로그
  console.log("🎯 현재 상태:", {
    accommodations: accommodations.length,
    filteredAccommodations: filteredAccommodations.length,
    loading,
    activeRegion,
    tripStartDate,
    tripEndDate,
  })

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen flex">
      {/* 왼쪽 패널 - 숙소 선택 */}
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
              placeholder="숙소 검색..."
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
                  2
                </div>
                <span className="text-xs mt-1 font-medium">숙소 선택</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-xs mt-1">관광지/맛집</span>
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
              {formatDate(tripStartDate)} - {formatDate(tripEndDate)} ({tripNights}박)
            </span>
            <Link href="/planning/flow/date-selection" className="ml-2 text-sm text-gray-600 hover:underline">
              변경
            </Link>
          </div>
        </div>

        {/* 지역 필터 */}
        <div className="p-4 border-b">
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

        {/* 디버깅 정보 표시 */}
        <div className="p-2 bg-yellow-50 border-b text-xs">
          <div>총 숙소: {accommodations.length}개</div>
          <div>필터된 숙소: {filteredAccommodations.length}개</div>
          <div>로딩: {loading ? "예" : "아니오"}</div>
          <div>지역: {activeRegion}</div>
        </div>

        {/* 숙소 목록 */}
        <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 400px)" }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">숙소를 검색하고 있습니다...</div>
            </div>
          ) : filteredAccommodations.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-gray-500 mb-2">검색된 숙소가 없습니다.</div>
                <div className="text-xs text-gray-400">
                  전체 데이터: {accommodations.length}개 | 필터 결과: {filteredAccommodations.length}개
                </div>
                <button
                  onClick={() => {
                    console.log("🔄 수동 새로고침")
                    searchAccommodations()
                  }}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  다시 검색
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredAccommodations.map((place) => (
                <div
                  key={place.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAccommodationClick(place)}
                >
                  <div className="relative h-48">
                    <Image
                      src={place.imageUrl || "/placeholder.svg?height=192&width=384&text=숙소이미지"}
                      alt={place.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=192&width=384&text=이미지없음"
                      }}
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md"
                      onClick={(e) => toggleFavorite(place.id, e)}
                    >
                      <Heart
                        size={18}
                        className={favorites.includes(place.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                      />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="text-white">
                        <h3 className="font-bold text-sm">{place.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <MapPin size={12} className="mr-1" />
                      <span>
                        위도: {place.latitude.toFixed(4)}, 경도: {place.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-sm font-bold text-blue-600">객실 보기</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t flex justify-between">
          <Link href="/planning/flow/date-selection" className="px-6 py-2 border rounded-md flex items-center">
            <ChevronLeft size={18} className="mr-1" />
            이전
          </Link>
          <button
            onClick={handleContinue}
            disabled={selectedAccommodations.length === 0}
            className={`px-8 py-2 rounded-md ${
              selectedAccommodations.length > 0
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            다음 단계로
          </button>
        </div>
      </div>

      {/* 중앙 패널 - 선택된 숙소 목록 */}
      <div className="w-1/4 border-r">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-medium">선택된 숙소</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedAccommodations.length === 0 ? (
              <div className="text-sm text-gray-500">아직 선택된 숙소가 없습니다.</div>
            ) : (
              <div className="space-y-4">
                {selectedAccommodations.map((accommodation, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{accommodation.place.name}</h4>
                      <button onClick={() => removeAccommodation(index)} className="text-gray-400 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{accommodation.room.roomName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(accommodation.checkInDate)} - {formatDate(accommodation.checkOutDate)}
                    </p>
                    <p className="text-sm font-bold mt-1">₩{accommodation.room.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 - 지도 */}
      <div className="w-1/4">
        <div className="h-full bg-gray-200 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl text-gray-400 font-bold mb-2">지도</div>
              <div className="text-sm text-gray-500">숙소 위치를 지도에서 확인하세요</div>
            </div>
          </div>
        </div>
      </div>

      {/* 숙소 상세 모달 */}
      {showDetailModal && selectedPlace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedPlace.name}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* 숙소 기본 정보 */}
              <div className="mb-6">
                <div className="relative h-64 mb-4">
                  <Image
                    src={selectedPlace.imageUrl || "/placeholder.svg?height=256&width=600&text=숙소이미지"}
                    alt={selectedPlace.name}
                    fill
                    className="object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=256&width=600&text=이미지없음"
                    }}
                  />
                </div>
                <div className="flex items-center mb-2 text-gray-700">
                  <MapPin size={16} className="mr-1" />
                  <span>
                    위도: {selectedPlace.latitude}, 경도: {selectedPlace.longitude}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">이용 가능한 객실</h3>
                {loading ? (
                  <div className="text-center py-8">객실 정보를 불러오는 중...</div>
                ) : availableRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">이용 가능한 객실이 없습니다.</div>
                ) : (
                  <div className="space-y-4">
                    {availableRooms.map((room) => (
                      <div key={room.roomId} className="border rounded-lg p-4">
                        <div className="flex">
                          {/* 객실 이미지 */}
                          <div className="w-1/3 mr-4">
                            {room.images && room.images.length > 0 ? (
                              <div className="relative h-32 rounded overflow-hidden">
                                <Image
                                  src={room.images[0] || "/placeholder.svg?height=128&width=200&text=객실이미지"}
                                  alt={room.roomName}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=128&width=200&text=이미지없음"
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-500 text-sm">이미지 없음</span>
                              </div>
                            )}
                            {/* 추가 이미지들 */}
                            {room.images && room.images.length > 1 && (
                              <div className="mt-2 flex gap-1 overflow-x-auto">
                                {room.images.slice(1, 4).map((image, index) => (
                                  <div key={index} className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                                    <Image
                                      src={image || "/placeholder.svg?height=64&width=64"}
                                      alt={`${room.roomName} ${index + 2}`}
                                      fill
                                      className="object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg?height=64&width=64&text=X"
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 객실 정보 */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-lg">{room.roomName}</h4>
                                <div className="text-sm text-gray-600 mt-1">객실 ID: {room.roomId}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">₩{room.price.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">/ 박</div>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => handleAddAccommodation(room, tripStartDate, tripEndDate)}
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                              >
                                이 객실 선택
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

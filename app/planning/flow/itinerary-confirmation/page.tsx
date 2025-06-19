"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  ChevronLeft,
  MapPin,
  ClockIcon,
  CarIcon,
  ArrowRightIcon,
  Save,
  Share2,
  Plus,
  Trash,
  Edit,
} from "lucide-react"
import { tripService } from "@/lib/trip-service"
import { authService } from "@/lib/auth-service"

interface SelectedPlace {
  place: any
  dayNumber: number
  sequence: number
}

export default function ItineraryConfirmationPage() {
  const router = useRouter()
  const [tripStartDate, setTripStartDate] = useState("")
  const [tripEndDate, setTripEndDate] = useState("")
  const [tripDays, setTripDays] = useState(1)
  const [activeDay, setActiveDay] = useState(1)
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([])
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentTripPlan, setCurrentTripPlan] = useState<any>(null)

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const storedStartDate = localStorage.getItem("tripStartDate")
    const storedEndDate = localStorage.getItem("tripEndDate")
    const storedDays = localStorage.getItem("tripDays")
    const storedTripPlanId = localStorage.getItem("currentTripPlanId")
    const storedSelectedPlaces = localStorage.getItem("selectedPlaces")

    if (storedStartDate) setTripStartDate(storedStartDate)
    if (storedEndDate) setTripEndDate(storedEndDate)
    if (storedDays) setTripDays(Number(storedDays))

    // 선택된 장소들 로드
    if (storedSelectedPlaces) {
      try {
        const places = JSON.parse(storedSelectedPlaces)
        setSelectedPlaces(places)
        console.log("✅ 선택된 장소 로드:", places.length, "개")
      } catch (error) {
        console.error("❌ 선택된 장소 파싱 실패:", error)
      }
    }

    // 인증 확인
    if (!authService.isAuthenticated()) {
      router.push("/login")
      return
    }

    // 여행 계획 로드
    if (storedTripPlanId) {
      loadTripPlan(Number(storedTripPlanId))
    }
  }, [])

  const loadTripPlan = async (planId: number) => {
    setLoading(true)
    try {
      // 여행 계획 정보 로드
      const planResponse = await tripService.getTripPlan(planId)
      if (planResponse.data) {
        setCurrentTripPlan(planResponse.data)
        console.log("✅ 여행 계획 로드 완료:", planResponse.data)
      }
    } catch (error) {
      console.error("❌ 여행 계획 로드 실패:", error)
    } finally {
      setLoading(false)
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

  const getDateForDay = (day: number) => {
    if (!tripStartDate) return ""
    const date = new Date(tripStartDate)
    date.setDate(date.getDate() + day - 1)
    return date.toISOString().split("T")[0]
  }

  const removePlace = (placeId: string) => {
    if (!editMode) return

    setSelectedPlaces((prev) => prev.filter((sp) => sp.place.id !== placeId))
  }

  const handleSaveItinerary = () => {
    alert("여행 일정이 저장되었습니다!")
    router.push("/")
  }

  const getPlacesForDay = (dayNumber: number) => {
    return selectedPlaces.filter((sp) => sp.dayNumber === dayNumber).sort((a, b) => a.sequence - b.sequence)
  }

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen flex">
      {/* 왼쪽 패널 - 일정 확인 */}
      <div className="w-2/3 border-r">
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center">
          <Link href="/" className="mr-4">
            <div className="text-xl font-bold">재곰제곰</div>
          </Link>
          <div className="text-lg font-medium ml-4">여행 계획 세우기</div>
        </div>

        {/* 진행 단계 표시 */}
        <div className="bg-white p-4 border-b">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="text-xs mt-1 font-medium">날짜 선택</span>
              </div>
              <div className="flex-1 h-1 bg-black mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="text-xs mt-1 font-medium">숙소 선택</span>
              </div>
              <div className="flex-1 h-1 bg-black mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="text-xs mt-1 font-medium">관광지/맛집</span>
              </div>
              <div className="flex-1 h-1 bg-black mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <span className="text-xs mt-1 font-medium">일정 확정</span>
              </div>
            </div>
          </div>
        </div>

        {/* 선택된 날짜 표시 */}
        <div className="bg-white p-4 border-b">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="text-black mr-2" size={20} />
              <span className="font-medium">
                {formatDate(tripStartDate)} - {formatDate(tripEndDate)} ({tripDays}일)
              </span>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center px-3 py-1 rounded-md text-sm ${
                editMode ? "bg-black text-white" : "border text-gray-700"
              }`}
            >
              <Edit size={16} className="mr-1" />
              {editMode ? "편집 완료" : "일정 편집"}
            </button>
          </div>
        </div>

        {/* 일자 탭 */}
        <div className="flex border-b overflow-x-auto">
          {Array.from({ length: tripDays }).map((_, index) => {
            const dayNumber = index + 1
            const dayDate = getDateForDay(dayNumber)
            const placesCount = getPlacesForDay(dayNumber).length

            return (
              <button
                key={`tab-${dayNumber}`}
                className={`px-6 py-3 whitespace-nowrap ${
                  activeDay === dayNumber ? "border-b-2 border-black font-medium" : "text-gray-500"
                }`}
                onClick={() => setActiveDay(dayNumber)}
              >
                {dayNumber}일차 ({formatDate(dayDate)}, {getDayOfWeek(dayDate)}) - {placesCount}개 장소
              </button>
            )
          })}
        </div>

        {/* 일정 내용 */}
        <div className="p-4 overflow-y-auto" style={{ height: "calc(100vh - 300px)" }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">일정을 불러오는 중...</div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">
                {activeDay}일차 일정 ({formatDate(getDateForDay(activeDay))}, {getDayOfWeek(getDateForDay(activeDay))})
              </h2>

              <div className="space-y-6">
                {getPlacesForDay(activeDay).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">선택된 장소가 없습니다</div>
                    <div className="text-gray-500 text-sm">이전 단계에서 관광지를 선택해주세요</div>
                  </div>
                ) : (
                  getPlacesForDay(activeDay).map((selectedPlace, index, array) => (
                    <div key={`${selectedPlace.place.id}-${activeDay}-${index}`} className="relative">
                      <div className="flex">
                        <div className="mr-4 relative">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-black">
                            {index + 1}
                          </div>
                          {index < array.length - 1 && (
                            <div className="absolute top-10 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">{selectedPlace.place.name}</h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <ClockIcon size={14} className="mr-1" />
                                <span>60분 체류 예정</span>
                              </div>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <MapPin size={14} className="mr-1" />
                                <span>{selectedPlace.place.address}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-16 h-16 relative rounded-md overflow-hidden">
                                <Image
                                  src={selectedPlace.place.imageUrl || "/placeholder.svg?height=64&width=64"}
                                  alt={selectedPlace.place.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {editMode && (
                                <button
                                  className="ml-2 p-1 text-gray-400 hover:text-red-500"
                                  onClick={() => removePlace(selectedPlace.place.id)}
                                >
                                  <Trash size={18} />
                                </button>
                              )}
                            </div>
                          </div>

                          {index < array.length - 1 && (
                            <div className="flex items-center mt-4 text-sm text-gray-500">
                              <CarIcon size={14} className="mr-1" />
                              <span>이동 시간: 약 30분</span>
                              <ArrowRightIcon size={14} className="mx-2" />
                              <span>다음 장소: {array[index + 1].place.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {editMode && (
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/planning/flow/attraction-selection"
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                  >
                    <Plus size={18} className="mr-2" />
                    장소 추가하기
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t flex justify-between">
          <Link href="/planning/flow/attraction-selection" className="px-6 py-2 border rounded-md flex items-center">
            <ChevronLeft size={18} className="mr-1" />
            이전
          </Link>
          <button onClick={handleSaveItinerary} className="px-8 py-2 rounded-md bg-black text-white hover:bg-gray-800">
            일정 저장하기
          </button>
        </div>
      </div>

      {/* 오른쪽 패널 - 지도 */}
      <div className="w-1/3">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">여행 경로</h2>
            <div className="flex gap-2">
              <button className="p-2 border rounded-md">
                <Save size={18} />
              </button>
              <button className="p-2 border rounded-md">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* 지도 영역 */}
          <div className="flex-1 bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl text-gray-400 font-bold mb-2">지도</div>
                <div className="text-sm text-gray-500">여행 경로를 지도에서 확인하세요</div>
                <div className="text-xs text-gray-400 mt-2">총 {selectedPlaces.length}개 장소가 선택되었습니다</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

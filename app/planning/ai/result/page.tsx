"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AIResultPage() {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [travelers, setTravelers] = useState<string>("")
  const [preferences, setPreferences] = useState<string>("")
  const [activeDay, setActiveDay] = useState<number>(1)
  const [editMode, setEditMode] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const storedStartDate = localStorage.getItem("aiTripStartDate")
    const storedEndDate = localStorage.getItem("aiTripEndDate")
    const storedTravelers = localStorage.getItem("aiTripTravelers")
    const storedPreferences = localStorage.getItem("aiTripPreferences")

    if (storedStartDate) setStartDate(storedStartDate)
    if (storedEndDate) setEndDate(storedEndDate)
    if (storedTravelers) setTravelers(storedTravelers)
    if (storedPreferences) setPreferences(storedPreferences)
  }, [])

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][date.getDay()]})`
  }

  // 여행 기간 계산
  const calculateDuration = (): string => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return `${diffDays}박 ${diffDays + 1}일`
    }
    return ""
  }

  // AI 추천 일정 (실제로는 API에서 받아올 내용)
  const aiSchedule = [
    {
      day: 1,
      date: startDate ? new Date(startDate).toISOString().split("T")[0] : "",
      title: "제주 동부 자연 탐방",
      description: "제주 동부의 아름다운 자연 경관을 즐기는 날입니다.",
      places: [
        {
          id: 1,
          name: "성산일출봉",
          time: "09:00 - 11:00",
          description: "유네스코 세계자연유산으로 등재된 제주의 대표 명소. 정상에서 바라보는 전망이 장관입니다.",
          tips: "정상까지 계단이 많으니 편안한 신발을 준비하세요.",
        },
        {
          id: 4,
          name: "우도",
          time: "12:00 - 16:00",
          description: "성산항에서 페리를 타고 이동하는 작은 섬으로, 아름다운 해변과 경관을 즐길 수 있습니다.",
          tips: "우도 내에서는 전기차나 자전거를 대여하는 것이 좋습니다.",
        },
        {
          id: 2,
          name: "만장굴",
          time: "16:30 - 18:00",
          description: "세계에서 가장 긴 용암 동굴 중 하나로, 독특한 지질학적 특징을 관찰할 수 있습니다.",
          tips: "내부가 어두우므로 안전을 위해 운동화를 착용하고, 겉옷을 준비하는 것이 좋습니다.",
        },
      ],
    },
    {
      day: 2,
      date: startDate ? new Date(startDate).toISOString().split("T")[0] : "",
      title: "제주 서부 해안 드라이브",
      description: "제주 서부의 아름다운 해안 도로를 따라 드라이브하며 숨겨진 명소들을 방문합니다.",
      places: [
        {
          id: 3,
          name: "애월 해안도로",
          time: "10:00 - 12:00",
          description: "해안선을 따라 이어진 아름다운 도로로, 다양한 카페와 맛집들이 위치해 있습니다.",
          tips: "차를 멈추고 해안가를 따라 산책하며 여유를 즐기세요.",
        },
        {
          id: 5,
          name: "협재해수욕장",
          time: "13:00 - 15:00",
          description: "얕은 수심과 고운 모래로 이루어진 해변으로, 가족 단위 여행객에게 인기가 많습니다.",
          tips: "여름에는 해수욕을 즐기기 좋고, 그 외 계절에는 해변을 따라 산책하기 좋습니다.",
        },
        {
          id: 6,
          name: "오설록 티 뮤지엄",
          time: "16:00 - 18:00",
          description: "녹차밭과 함께 다양한 차 문화를 체험할 수 있는 공간입니다.",
          tips: "녹차 아이스크림이나 롤케이크를 맛보는 것을 추천합니다.",
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">AI 추천 여행 일정</h1>
            <div className="space-x-4">
              <Link href="/" className="text-blue-500 hover:text-blue-700">
                홈으로
              </Link>
              <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-700">
                이전 페이지
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Trip Summary */}
        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">여행 개요</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">여행에 대한 기본 정보입니다.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">여행 기간</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{calculateDuration()}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">시작 날짜</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(startDate)}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">종료 날짜</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(endDate)}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">여행자 수</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{travelers} 명</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">선호 사항</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{preferences}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">일정</h2>
          <div className="flex space-x-4 overflow-x-auto mb-4">
            {aiSchedule.map((daySchedule) => (
              <button
                key={daySchedule.day}
                className={`px-4 py-2 rounded-full ${activeDay === daySchedule.day ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-300 transition-colors duration-200`}
                onClick={() => setActiveDay(daySchedule.day)}
              >
                {daySchedule.day}일차
              </button>
            ))}
          </div>

          {/* Display schedule for the active day */}
          {aiSchedule.find((daySchedule) => daySchedule.day === activeDay) && (
            <div className="bg-white shadow overflow-hidden rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeDay}일차: {aiSchedule.find((daySchedule) => daySchedule.day === activeDay)?.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {aiSchedule.find((daySchedule) => daySchedule.day === activeDay)?.description}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  {aiSchedule
                    .find((daySchedule) => daySchedule.day === activeDay)
                    ?.places.map((place, index) => (
                      <div
                        key={place.id}
                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          {place.name} ({place.time})
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {place.description}
                          <p className="mt-2 text-gray-600">{place.tips}</p>
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

export default function DateSelectionPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user?.email) {
      alert("로그인이 필요합니다.")
      router.replace("/login")
      return
    }
    setUserEmail(user.email)
  }, [router])

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else {
      if (date < selectedStartDate) {
        setSelectedStartDate(date)
        setSelectedEndDate(selectedStartDate)
      } else {
        setSelectedEndDate(date)
      }
    }
  }

  const isDateSelected = (date: Date) => {
    if (!selectedStartDate) return false
    if (!selectedEndDate) return date.toDateString() === selectedStartDate.toDateString()
    return date >= selectedStartDate && date <= selectedEndDate
  }

  const isStartDate = (date: Date) => selectedStartDate && date.toDateString() === selectedStartDate.toDateString()

  const isEndDate = (date: Date) => selectedEndDate && date.toDateString() === selectedEndDate.toDateString()

  const nextMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setCurrentMonth(newMonth)
  }

  const prevMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setCurrentMonth(newMonth)
  }

  const renderCalendar = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    days.push(
      <div key="header" className="grid grid-cols-7 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div key={`header-${index}`} className="text-center py-2 font-medium">
            {day}
          </div>
        ))}
      </div>,
    )

    const dayGrid = []

    for (let i = 0; i < firstDay; i++) {
      dayGrid.push(<div key={`prev-${i}`} className="text-gray-300 p-3 text-center"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      const isToday = new Date().toDateString() === currentDate.toDateString()
      const isSelected = isDateSelected(currentDate)
      const isStart = isStartDate(currentDate)
      const isEnd = isEndDate(currentDate)

      dayGrid.push(
        <div
          key={`current-${i}`}
          className={`p-3 text-center cursor-pointer relative ${isToday ? "font-bold" : ""}`}
          onClick={() => handleDateClick(currentDate)}
        >
          <div
            className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full
              ${
                isSelected
                  ? isStart && isEnd
                    ? "bg-black text-white"
                    : isStart
                      ? "bg-black text-white"
                      : isEnd
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                  : "hover:bg-gray-100"
              }`}
          >
            {i}
          </div>
        </div>,
      )
    }

    days.push(
      <div key="days" className="grid grid-cols-7">
        {dayGrid}
      </div>,
    )

    return days
  }

  const handleContinue = () => {
    if (selectedStartDate && selectedEndDate && userEmail) {
      const prefix = (key: string) => `${key}-${userEmail}`
      localStorage.setItem(prefix("tripStartDate"), selectedStartDate.toISOString().split("T")[0])
      localStorage.setItem(prefix("tripEndDate"), selectedEndDate.toISOString().split("T")[0])
      const diffTime = Math.abs(selectedEndDate.getTime() - selectedStartDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      localStorage.setItem(prefix("tripNights"), diffDays.toString())
      localStorage.setItem(prefix("tripDays"), (diffDays + 1).toString())

      router.push("/planning/flow/accommodation-selection")
    }
  }

  const formatDateRange = () => {
    if (!selectedStartDate) return ""
    const formatDate = (date: Date) => `${date.getMonth() + 1}월 ${date.getDate()}일`
    return selectedEndDate
      ? `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
      : formatDate(selectedStartDate)
  }

  const calculateNights = () => {
    if (!selectedStartDate || !selectedEndDate) return ""
    const diffTime = Math.abs(selectedEndDate.getTime() - selectedStartDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays}박 ${diffDays + 1}일`
  }

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen flex">
      {/* 왼쪽 패널 - 달력 */}
      <div className="w-2/3 p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">여행 날짜를 선택해주세요</h1>
          <p className="text-gray-600">출발일과 도착일을 선택하세요</p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <div className="flex items-center justify-between max-w-md">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="text-xs mt-1 font-medium">날짜 선택</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="text-xs mt-1">숙소 선택</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-xs mt-1">관광지/맛집</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <span className="text-xs mt-1">일정 확정</span>
            </div>
          </div>
        </div>

        {/* 달력 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 달력 */}
        <div className="bg-white border rounded-lg p-4">{renderCalendar(currentMonth)}</div>
      </div>

      {/* 오른쪽 패널 - 선택된 날짜 정보 */}
      <div className="w-1/3 bg-gray-50 p-8">
        <div className="sticky top-8">
          <h3 className="text-lg font-semibold mb-4">선택된 날짜</h3>

          {selectedStartDate ? (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar size={20} className="text-black mr-2" />
                  <span className="font-medium">여행 기간</span>
                </div>
                <p className="text-lg font-semibold">{formatDateRange()}</p>
                {selectedStartDate && selectedEndDate && (
                  <p className="text-sm text-gray-600 mt-1">{calculateNights()}</p>
                )}
              </div>

              {selectedStartDate && selectedEndDate && (
                <button
                  onClick={handleContinue}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  다음 단계로
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>달력에서 날짜를 선택해주세요</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 팁</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 출발일을 먼저 선택하세요</li>
              <li>• 그 다음 도착일을 선택하세요</li>
              <li>• 최소 1박 2일 이상 선택 가능합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

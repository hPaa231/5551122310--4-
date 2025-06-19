import Link from "next/link"
import { Calendar, MapPin, Utensils, Home } from "lucide-react"

export default function PlanningPage() {
  return (
    <div className="max-w-full mx-auto bg-white min-h-screen">
      {/* 상단 헤더 삭제 */}

      {/* 메인 콘텐츠 */}
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">나만의 제주도 여행 계획 만들기</h1>
        <p className="text-center text-gray-600 mb-12">
          날짜 선택부터 숙소, 관광지, 맛집까지 한 번에 계획하고 멋진 여행을 떠나보세요!
        </p>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-100 p-8 rounded-lg shadow-sm h-full">
            <h2 className="text-2xl font-bold mb-4">여행 계획 세우기</h2>
            <p className="text-gray-600 mb-6">
              날짜 선택부터 숙소, 관광지, 맛집까지 단계별로 선택하여 나만의 맞춤 여행 일정을 만들어보세요.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <span className="text-lg">여행 날짜 선택</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <span className="text-lg">숙소 선택</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <span className="text-lg">관광지/맛집 선택</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <span className="text-lg">일정 확정</span>
              </div>
            </div>
            <Link
              href="/planning/flow/date-selection"
              className="block w-full py-4 bg-black text-white text-center rounded-md font-medium hover:bg-gray-800 transition-colors text-lg"
            >
              여행 계획 세우기
            </Link>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg shadow-sm h-full">
            <h2 className="text-2xl font-bold mb-4">AI 여행 플래너</h2>
            <p className="text-gray-600 mb-6">
              여행 스타일과 선호도를 입력하면 AI가 최적의 제주도 여행 일정을 추천해드립니다.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Calendar size={24} className="text-black mr-3" />
                <span className="text-lg">여행 날짜 입력</span>
              </div>
              <div className="flex items-center">
                <Home size={24} className="text-black mr-3" />
                <span className="text-lg">선호하는 숙소 유형 선택</span>
              </div>
              <div className="flex items-center">
                <Utensils size={24} className="text-black mr-3" />
                <span className="text-lg">관심 있는 장소와 음식 입력</span>
              </div>
              <div className="flex items-center">
                <MapPin size={24} className="text-black mr-3" />
                <span className="text-lg">AI가 최적의 일정 생성</span>
              </div>
            </div>
            <Link
              href="/planning/ai"
              className="block w-full py-4 bg-black text-white text-center rounded-md font-medium hover:bg-gray-800 transition-colors text-lg"
            >
              AI 여행 플래너 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

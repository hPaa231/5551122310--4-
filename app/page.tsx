import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { destinations } from "@/data/destinations"
import { trips } from "@/data/trips"
import { travelCourses } from "@/data/travel-courses"

export default function Home() {
  // 데이터가 없을 경우 기본값 설정
  const destinationsData = destinations || []
  const tripsData = trips || []
  const travelCoursesData = travelCourses || []

  return (
    <div className="w-full bg-white">
      {/* 현대적인 히어로 섹션 */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="제주도 풍경"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
              제주도의
              <br />
              특별한 순간
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-lg">
              아름다운 자연과 독특한 문화가 어우러진 제주도에서 잊지 못할 추억을 만들어보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/planning">
                <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg">
                  여행 계획하기
                </Button>
              </Link>
              <Link href="/schedules">
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg"
                >
                  여행 일정 확인하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 - 간결한 버전 */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">카테고리</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "관광지", icon: "map-pin", href: "/attractions" },
              { title: "숙소", icon: "home", href: "/accommodations" },
              { title: "맛집", icon: "utensils", href: "/restaurants" },
              { title: "항공권", icon: "plane", href: "/flights" },
            ].map((category, index) => (
              <Link href={category.href} key={index} className="group">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md p-6 flex items-center gap-4 transition-all">
                  <div className="bg-black p-3 rounded-full">
                    {category.icon === "map-pin" && <MapPin className="text-white" size={24} />}
                    {category.icon === "home" && (
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
                        className="text-white"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    )}
                    {category.icon === "utensils" && (
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
                        className="text-white"
                      >
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                        <path d="M7 2v20"></path>
                        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                      </svg>
                    )}
                    {category.icon === "plane" && (
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
                        className="text-white"
                      >
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-lg font-medium">{category.title}</span>
                    <div className="flex items-center mt-1 text-gray-500 group-hover:text-black">
                      <span className="text-sm">자세히 보기</span>
                      <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 여행지 섹션 */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">인기 여행지</h2>
              <p className="text-gray-600">제주도의 아름다운 명소를 만나보세요</p>
            </div>
            <Link href="/attractions" className="flex items-center text-black font-medium hover:underline">
              모두 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationsData.slice(0, 3).map((destination, index) => (
              <Link href={`/attractions/${destination.id}`} key={index} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={destination.image || `/placeholder.svg?height=400&width=600&text=Destination${index + 1}`}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span className="text-sm">{destination.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 font-medium">{destination.rating}</span>
                      </div>
                      <span className="text-gray-500 ml-1">({destination.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {destination.tags &&
                        destination.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-xs px-3 py-1.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 관광지 섹션 */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">관광지</h2>
              <p className="text-gray-600">제주도의 아름다운 관광지를 둘러보세요</p>
            </div>
            <Link href="/attractions" className="flex items-center text-black font-medium hover:underline">
              모두 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationsData.slice(3, 6).map((destination, index) => (
              <Link href={`/attractions/${destination.id}`} key={index} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={destination.image || `/placeholder.svg?height=400&width=600&text=Attraction${index + 1}`}
                      alt={destination.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span className="text-sm">{destination.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 font-medium">{destination.rating}</span>
                      </div>
                      <span className="text-gray-500 ml-1">({destination.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {destination.tags &&
                        destination.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-xs px-3 py-1.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 맛집 섹션 */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">맛집</h2>
              <p className="text-gray-600">제주도의 맛있는 음식을 경험해보세요</p>
            </div>
            <Link href="/restaurants" className="flex items-center text-black font-medium hover:underline">
              모두 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 맛집 데이터가 없으므로 임시 데이터 사용 */}
            {[1, 2, 3].map((index) => (
              <Link href={`/restaurants/${index}`} key={index} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=400&width=600&text=Restaurant${index}`}
                      alt={`맛집 ${index}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span className="text-sm">제주시 {index}번지</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">제주 맛집 {index}</h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 font-medium">{4.5 + index * 0.1}</span>
                      </div>
                      <span className="text-gray-500 ml-1">({100 + index * 20})</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["한식", "제주 특산", "해산물"].map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-xs px-3 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 여행 코스 섹션 */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">추천 여행 코스</h2>
              <p className="text-gray-600">제주도를 더 특별하게 즐기는 방법</p>
            </div>
            <Link href="/planning/recommended" className="flex items-center text-black font-medium hover:underline">
              모든 코스 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {travelCoursesData.slice(0, 2).map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative">
                    <div className="h-48 md:h-full relative">
                      <Image
                        src={course.image || `/placeholder.svg?height=400&width=300&text=Course${index + 1}`}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                      {course.days}일 코스
                    </div>
                  </div>

                  <div className="md:w-3/5 p-6">
                    <div className="mb-1">
                      <span className="text-sm text-gray-500">{course.theme}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">주요 방문지</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.places &&
                          course.places.slice(0, 3).map((place, idx) => (
                            <span key={idx} className="bg-gray-100 text-xs px-3 py-1.5 rounded-full">
                              {place}
                            </span>
                          ))}
                        {course.places && course.places.length > 3 && (
                          <span className="text-xs text-gray-500 flex items-center">+{course.places.length - 3}곳</span>
                        )}
                      </div>
                    </div>

                    <Link href={`/planning/recommended/${course.id}`}>
                      <Button className="bg-black text-white hover:bg-gray-800 rounded-full">
                        자세히 보기 <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 간단한 푸터 - 오렌지 배경만 */}
      <footer className="bg-gradient-to-r from-orange-400 to-orange-500 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">{/* 빈 공간 */}</div>
      </footer>
    </div>
  )
}

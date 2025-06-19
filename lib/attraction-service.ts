import { apiClient } from "./api-client"

export interface Place {
  contentsId: string
  name: string
  address?: string
  latitude?: number
  longitude?: number
  imageUrl?: string
  introduction?: string
  category?: string
  tag?: string
}

export class AttractionService {
  // 관광지 데이터 가져오기
  async getAttractions(page = 1, size = 100): Promise<Place[]> {
    console.log("🏝️ AttractionService.getAttractions 호출됨:", { page, size })

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      })

      const response = await apiClient.get<Place[]>(`/visitjeju/import?${queryParams.toString()}`)
      console.log("✅ 관광지 데이터 가져오기 성공:", response.data?.length || 0, "개")

      // API 응답 구조 확인
      console.log("📦 관광지 응답 구조:", response)

      // response.data가 없으면 response 자체를 확인
      const data = response.data || response
      console.log("📋 실제 관광지 데이터:", Array.isArray(data) ? data.slice(0, 3) : data)

      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("❌ 관광지 데이터 가져오기 실패:", error)
      throw error
    }
  }

  // 제주 관광지 데이터 가져오기 및 저장 (기존 메서드 유지)
  async importAttractions(page = 1, size = 100): Promise<Place[]> {
    console.log("🏝️ AttractionService.importAttractions 호출됨:", { page, size })

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      })

      const response = await apiClient.get<Place[]>(`/visitjeju/import?${queryParams.toString()}`)
      console.log("✅ 관광지 데이터 가져오기 성공:", response.data?.length || 0, "개")
      return response.data || []
    } catch (error) {
      console.error("❌ 관광지 데이터 가져오기 실패:", error)
      throw error
    }
  }

  // 카테고리별 관광지 필터링 (클라이언트 사이드)
  filterByCategory(attractions: Place[], category: string): Place[] {
    if (category === "전체") return attractions

    return attractions.filter((attraction) => {
      if (!attraction.category) return false

      switch (category) {
        case "관광지":
          return attraction.category.includes("관광지") || attraction.category.includes("명소")
        case "맛집":
          return attraction.category.includes("음식") || attraction.category.includes("맛집")
        case "카페":
          return attraction.category.includes("카페") || attraction.category.includes("커피")
        case "쇼핑":
          return attraction.category.includes("쇼핑") || attraction.category.includes("상점")
        case "액티비티":
          return (
            attraction.category.includes("체험") ||
            attraction.category.includes("액티비티") ||
            attraction.category.includes("레저")
          )
        default:
          return true
      }
    })
  }

  // 지역별 관광지 필터링 (클라이언트 사이드)
  filterByRegion(attractions: Place[], region: string): Place[] {
    if (region === "전체") return attractions

    return attractions.filter((attraction) => {
      if (!attraction.address) return false
      return attraction.address.includes(region)
    })
  }

  // 검색어로 관광지 필터링 (클라이언트 사이드)
  searchAttractions(attractions: Place[], query: string): Place[] {
    if (!query.trim()) return attractions

    const searchTerm = query.toLowerCase().trim()

    return attractions.filter((attraction) => {
      return (
        attraction.name.toLowerCase().includes(searchTerm) ||
        (attraction.address && attraction.address.toLowerCase().includes(searchTerm)) ||
        (attraction.introduction && attraction.introduction.toLowerCase().includes(searchTerm)) ||
        (attraction.tag && attraction.tag.toLowerCase().includes(searchTerm))
      )
    })
  }
}

export const attractionService = new AttractionService()

// 타입 export
export type { Place }

import { apiClient } from "./api-client"

export const accommodationService = {
  async searchPlaces(region: string, checkIn: string, checkOut: string, personal: number) {
    console.log("🏨 AccommodationService.searchPlaces 호출됨:", { region, checkIn, checkOut, personal })

    try {
      // URL 파라미터를 직접 문자열로 구성
      const queryParams = new URLSearchParams({
        region,
        checkIn,
        checkOut,
        personal: personal.toString(),
      })

      const response = await apiClient.get(`/yeogi/places?${queryParams.toString()}`)

      // 응답 구조 확인을 위한 로그
      console.log("🔍 전체 응답 객체:", response)
      console.log("📦 response.data:", response.data)
      console.log("📊 response.data 타입:", typeof response.data)
      console.log("🔢 response.data 길이:", Array.isArray(response.data) ? response.data.length : "Not an array")

      // 응답 데이터를 그대로 반환 (필터링 없음)
      const data = response.data || response || []
      console.log("✅ 최종 반환 데이터 개수:", Array.isArray(data) ? data.length : "Not an array")
      console.log("📋 첫 번째 항목:", data[0])

      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("❌ 숙소 검색 실패:", error)
      return []
    }
  },

  async searchRooms(placeId: string, checkIn: string, checkOut: string, personal: number) {
    console.log("🛏️ AccommodationService.searchRooms 호출됨:", { placeId, checkIn, checkOut, personal })

    try {
      const queryParams = new URLSearchParams({
        checkIn,
        checkOut,
        personal: personal.toString(),
      })

      const response = await apiClient.get(`/yeogi/rooms/${placeId}?${queryParams.toString()}`)
      const data = response.data || response || []

      console.log("✅ 객실 검색 성공:", Array.isArray(data) ? data.length : "Not an array", "개")
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("❌ 객실 검색 실패:", error)
      return []
    }
  },
}

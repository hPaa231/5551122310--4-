import { apiClient } from "./api-client"
import { authService } from "./auth-service"
import type {
  TripPlanDto,
  TripDayDto,
  TripDayWithDestinationsDto,
  DestinationDto,
  CreateTripPlanRequest,
  AddTripDayRequest,
  CreateDestinationRequest,
  UpdateSequenceRequest,
  CostDto,
} from "@/types/api-types"

export class TripService {
  // 여행 계획 생성
  async createTripPlan(planName: string, startDate: string, endDate: string): Promise<{ data: TripPlanDto }> {
    console.log("🗓️ TripService.createTripPlan 호출됨:", { planName, startDate, endDate })

    const user = authService.getCurrentUser()
    if (!user) {
      throw new Error("로그인이 필요합니다.")
    }

    const requestData: CreateTripPlanRequest = {
      planName,
      startDate,
      endDate,
    }

    try {
      const response = await apiClient.post<TripPlanDto>("/api/trip-plans", requestData)
      console.log("✅ 여행 계획 생성 성공:", response.data)
      return response
    } catch (error) {
      console.error("❌ 여행 계획 생성 실패:", error)
      throw error
    }
  }

  // 여행 계획 조회
  async getTripPlan(planId: number): Promise<{ data: TripPlanDto }> {
    console.log("📋 TripService.getTripPlan 호출됨:", { planId })

    try {
      const response = await apiClient.get<TripPlanDto>(`/api/trip-plans/${planId}`)
      console.log("✅ 여행 계획 조회 성공:", response.data)
      return response
    } catch (error) {
      console.error("❌ 여행 계획 조회 실패:", error)
      throw error
    }
  }

  // 여행 일정과 목적지 함께 조회
  async getTripDaysWithDestinations(planId: number): Promise<{ data: TripDayWithDestinationsDto[] }> {
    console.log("📅 TripService.getTripDaysWithDestinations 호출됨:", { planId })

    try {
      const response = await apiClient.get<TripDayWithDestinationsDto[]>(`/api/trip-plans/${planId}/days-with-dests`)
      console.log("✅ 일정과 목적지 조회 성공:", response.data?.length || 0, "일")
      return response
    } catch (error) {
      console.error("❌ 일정과 목적지 조회 실패:", error)
      throw error
    }
  }

  // 여행 일정 추가
  async addTripDay(planId: number, date: string): Promise<{ data: TripDayDto }> {
    console.log("📅 TripService.addTripDay 호출됨:", { planId, date })

    const requestData: AddTripDayRequest = {
      date,
    }

    try {
      const response = await apiClient.post<TripDayDto>(`/api/trip-plans/${planId}/days`, requestData)
      console.log("✅ 여행 일정 추가 성공:", response.data)
      return response
    } catch (error) {
      console.error("❌ 여행 일정 추가 실패:", error)
      throw error
    }
  }

  // 목적지 추가
  async addDestination(
    dayId: number,
    placeId: string,
    type: string,
    sequence: number,
    duration: number,
    transportation?: string,
    price?: number,
  ): Promise<{ data: DestinationDto }> {
    console.log("📍 TripService.addDestination 호출됨:", {
      dayId,
      placeId,
      type,
      sequence,
      duration,
      transportation,
      price,
    })

    const requestData: CreateDestinationRequest = {
      tripDayId: dayId,
      sequence,
      transportation,
      duration,
      placeId,
      type,
      price,
    }

    try {
      const response = await apiClient.post<DestinationDto>(`/api/trip-days/${dayId}/destinations`, requestData)
      console.log("✅ 목적지 추가 성공:", response.data)
      return response
    } catch (error) {
      console.error("❌ 목적지 추가 실패:", error)
      throw error
    }
  }

  // 목적지 삭제
  async removeDestination(dayId: number, destId: number): Promise<void> {
    console.log("🗑️ TripService.removeDestination 호출됨:", { dayId, destId })

    try {
      await apiClient.delete(`/api/trip-days/${dayId}/destinations/${destId}`)
      console.log("✅ 목적지 삭제 성공")
    } catch (error) {
      console.error("❌ 목적지 삭제 실패:", error)
      throw error
    }
  }

  // 목적지 순서 변경
  async updateDestinationSequence(dayId: number, orderedDestinationIds: number[]): Promise<void> {
    console.log("🔄 TripService.updateDestinationSequence 호출됨:", { dayId, orderedDestinationIds })

    const requestData: UpdateSequenceRequest = {
      tripDayId: dayId,
      orderedDestinationIds,
    }

    try {
      await apiClient.put(`/api/trip-days/${dayId}/destinations/sequence`, requestData)
      console.log("✅ 목적지 순서 변경 성공")
    } catch (error) {
      console.error("❌ 목적지 순서 변경 실패:", error)
      throw error
    }
  }

  // 여행 비용 조회
  async getTripCosts(planId: number): Promise<{ data: CostDto[] }> {
    console.log("💰 TripService.getTripCosts 호출됨:", { planId })

    try {
      const response = await apiClient.get<CostDto[]>(`/api/trip-plans/${planId}/costs`)
      console.log("✅ 여행 비용 조회 성공:", response.data?.length || 0, "개")
      return response
    } catch (error) {
      console.error("❌ 여행 비용 조회 실패:", error)
      throw error
    }
  }
}

export const tripService = new TripService()

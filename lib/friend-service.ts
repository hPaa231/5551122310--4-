import { apiClient, type ApiResponse } from "./api-client"
import { authService } from "./auth-service"
import type { FriendResponseDto, FriendRequestDto } from "@/types/api-types"

export class FriendService {
  // 친구 목록 조회
  async getFriendList(): Promise<ApiResponse<FriendResponseDto[]>> {
    console.log("👥 FriendService.getFriendList 호출됨")

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.get<FriendResponseDto[]>(endpoint)
  }

  // 친구 요청
  async addFriend(friendUserId: number): Promise<ApiResponse<any>> {
    console.log("➕ FriendService.addFriend 호출됨:", friendUserId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.post<any>(endpoint, friendUserId)
  }

  // 친구 삭제
  async deleteFriend(friendId: number): Promise<ApiResponse<any>> {
    console.log("🗑️ FriendService.deleteFriend 호출됨:", friendId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend/${friendId}?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.delete<any>(endpoint)
  }

  // 보낸 친구 요청 목록 조회
  async getSentRequests(): Promise<ApiResponse<FriendRequestDto[]>> {
    console.log("📤 FriendService.getSentRequests 호출됨")

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend/request/sent?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.get<FriendRequestDto[]>(endpoint)
  }

  // 받은 친구 요청 목록 조회
  async getReceivedRequests(): Promise<ApiResponse<FriendRequestDto[]>> {
    console.log("📥 FriendService.getReceivedRequests 호출됨")

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend/request/received?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.get<FriendRequestDto[]>(endpoint)
  }

  // 친구 요청 수락
  async acceptRequest(requestId: number): Promise<ApiResponse<any>> {
    console.log("✅ FriendService.acceptRequest 호출됨:", requestId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend/request/${requestId}/accept?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.post<any>(endpoint, {})
  }

  // 친구 요청 거절
  async rejectRequest(requestId: number): Promise<ApiResponse<any>> {
    console.log("❌ FriendService.rejectRequest 호출됨:", requestId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend/request/${requestId}/reject?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.delete<any>(endpoint)
  }

  // 친구 요청 취소
  async cancelRequest(requestId: number): Promise<ApiResponse<any>> {
    console.log("🚫 FriendService.cancelRequest 호출됨:", requestId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/friend/request/${requestId}?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.delete<any>(endpoint)
  }
}

export const friendService = new FriendService()

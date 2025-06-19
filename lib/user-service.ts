import { apiClient, type ApiResponse } from "./api-client"
import { authService } from "./auth-service"
import type { MypageResponseDto, ProfileUpdateDto } from "@/types/api-types"

export class UserService {
  // 마이페이지 조회
  async getMypage(): Promise<ApiResponse<MypageResponseDto>> {
    console.log("👤 UserService.getMypage 호출됨")

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/user/mypage?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.get<MypageResponseDto>(endpoint)
  }

  // 프로필 수정
  async updateProfile(
    nickname?: string,
    password?: string,
    deleteProfileImage?: boolean,
    image?: File,
  ): Promise<ApiResponse<any>> {
    console.log("✏️ UserService.updateProfile 호출됨:", { nickname, deleteProfileImage })

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const formData = new FormData()

    const profileData: ProfileUpdateDto = {
      ...(nickname && { nickname }),
      ...(password && { password }),
      ...(deleteProfileImage !== undefined && { deleteProfileImage }),
    }

    formData.append("user", JSON.stringify(currentUser))
    formData.append("data", JSON.stringify(profileData))

    if (image) {
      formData.append("image", image)
    }

    try {
      const response = await apiClient.patch<any>("/api/user/mypage", formData)
      console.log("✅ 프로필 수정 성공:", response)

      // 프로필 수정 성공 시 사용자 정보 업데이트
      if (nickname) {
        const updatedUser = { ...currentUser, nickname }
        authService.saveUser(updatedUser)
      }

      return response
    } catch (error) {
      console.error("❌ 프로필 수정 오류:", error)
      throw error
    }
  }

  // 회원 탈퇴
  async deleteUser(): Promise<ApiResponse<any>> {
    console.log("🗑️ UserService.deleteUser 호출됨")

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/user?user=${encodeURIComponent(JSON.stringify(currentUser))}`

    try {
      const response = await apiClient.delete<any>(endpoint)
      console.log("✅ 회원 탈퇴 성공:", response)

      // 탈퇴 성공 시 로그아웃 처리
      authService.logout()

      return response
    } catch (error) {
      console.error("❌ 회원 탈퇴 오류:", error)
      throw error
    }
  }
}

export const userService = new UserService()

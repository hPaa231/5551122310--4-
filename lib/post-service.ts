import { apiClient, type ApiResponse } from "./api-client"
import { authService } from "./auth-service"
import type { PageResponseDto, PostDetailResponseDto, PostRequestDto, PostUpdateDto } from "@/types/api-types"

export class PostService {
  // 게시글 전체 조회
  async getPosts(page: number, keyword?: string): Promise<ApiResponse<PageResponseDto>> {
    let endpoint = `/api/post?page=${page}&_nocache=${Date.now()}`
    if (keyword) {
      endpoint += `&keyword=${encodeURIComponent(keyword)}`
    }
    console.log("📡 게시글 목록 API 요청:", endpoint)

    return apiClient.get<PageResponseDto>(endpoint)
  }

  // 게시글 상세 조회
  async getPostById(postId: number): Promise<ApiResponse<PostDetailResponseDto>> {
    console.log("📡 게시글 상세 API 요청:", postId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.get<PostDetailResponseDto>(endpoint)
  }

  // 게시글 작성
  async createPost(title: string, content: string, images?: File[], planId?: number): Promise<ApiResponse<any>> {
    console.log("🚀 PostService.createPost 호출됨")
    console.log("📋 전달받은 데이터:", { title, content, imageCount: images?.length || 0, planId })

    if (!authService.isAuthenticated()) {
      throw new Error("로그인이 필요합니다.")
    }

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.")
    }

    try {
      const formData = new FormData()

      const postData: PostRequestDto = {
        title: title.trim(),
        content: content.trim(),
        ...(planId && { planId }),
      }

      console.log("📤 서버로 전송할 데이터:", postData)

      formData.append("user", JSON.stringify(currentUser))
      formData.append("data", JSON.stringify(postData))

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          console.log(`📎 이미지 ${index + 1} 추가:`, image.name, image.size)
          formData.append("images", image)
        })
      }

      const response = await apiClient.postFormData<any>("/api/post", formData)
      console.log("✅ PostService 응답 받음:", response)
      return response
    } catch (error) {
      console.error("❌ PostService.createPost 오류:", error)
      throw error
    }
  }

  // 게시글 수정
  async updatePost(
    postId: number,
    title?: string,
    content?: string,
    planId?: number,
    deleteImages?: number[],
    newImages?: File[],
  ): Promise<ApiResponse<any>> {
    console.log("✏️ 게시글 수정:", { postId, title, content, planId, deleteImages, newImages })

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const formData = new FormData()

    const postData: PostUpdateDto = {
      ...(title && { title }),
      ...(content && { content }),
      ...(planId && { planId }),
      ...(deleteImages && deleteImages.length > 0 && { deleteImages }),
    }

    formData.append("user", JSON.stringify(currentUser))
    formData.append("data", JSON.stringify(postData))

    if (newImages && newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append("images", image)
      })
    }

    return apiClient.putFormData<any>(`/api/post/${postId}`, formData)
  }

  // 게시글 삭제
  async deletePost(postId: number): Promise<ApiResponse<any>> {
    console.log("🗑️ 게시글 삭제:", postId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.delete<any>(endpoint)
  }

  // 게시글 좋아요
  async likePost(postId: number): Promise<ApiResponse<any>> {
    console.log("❤️ 게시글 좋아요:", postId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}/like?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.put<any>(endpoint, {})
  }

  // 게시글 좋아요 취소
  async unlikePost(postId: number): Promise<ApiResponse<any>> {
    console.log("💔 게시글 좋아요 취소:", postId)

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}/like?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.delete<any>(endpoint)
  }

  // 댓글 작성
  async createComment(postId: number, content: string): Promise<ApiResponse<any>> {
    console.log("💬 댓글 작성:", { postId, content })

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}/comment?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.post<any>(endpoint, content)
  }

  // 댓글 수정
  async updateComment(postId: number, commentId: number, content: string): Promise<ApiResponse<any>> {
    console.log("✏️ 댓글 수정:", { postId, commentId, content })

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}/comment/${commentId}?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.put<any>(endpoint, content)
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<ApiResponse<any>> {
    console.log("🗑️ 댓글 삭제:", { postId, commentId })

    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      throw new Error("로그인이 필요합니다.")
    }

    const endpoint = `/api/post/${postId}/comment/${commentId}?user=${encodeURIComponent(JSON.stringify(currentUser))}`
    return apiClient.delete<any>(endpoint)
  }
}

export const postService = new PostService()

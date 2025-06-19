import { authService } from "./auth-service"
import { mockApiService } from "./mock-api"

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

class ApiClient {
  private baseURL: string

  constructor() {
    // Mock API 사용 여부 확인
    if (mockApiService.isUsingMockApi()) {
      this.baseURL = ""
      console.log("🎭 Mock API 모드로 실행 중")
    } else if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      this.baseURL = "http://3.36.89.140:8080"
      console.log("🌐 실제 API 모드로 실행 중 - Base URL:", this.baseURL)
    } else {
      this.baseURL = ""
      console.log("🌐 프록시 모드로 실행 중")
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const accessToken = authService.getAccessToken()
    if (accessToken) {
      console.log("🔑 Authorization 헤더 설정")
      headers.Authorization = `Bearer ${accessToken}`
    }

    return headers
  }

  private async handleTokenRefresh(): Promise<boolean> {
    try {
      console.log("🔄 토큰 갱신 시도...")
      const refreshToken = authService.getRefreshToken()
      if (!refreshToken) {
        console.log("❌ 리프레시 토큰이 없음")
        return false
      }

      const response = await authService.reissueToken(refreshToken)
      if (response.data) {
        console.log("✅ 토큰 갱신 성공")
        authService.saveTokens(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error("❌ 토큰 갱신 실패:", error)
      return false
    }
  }

  private getAccessTokenExpiration(): number | null {
    return authService.getAccessTokenExpiration()
  }

  async get<T>(endpoint: string, retryCount = 0): Promise<ApiResponse<T>> {
    // Mock API 사용
    if (mockApiService.isUsingMockApi()) {
      if (endpoint === "/api/posts") {
        return mockApiService.mockGetPosts() as Promise<ApiResponse<T>>
      }

      const postIdMatch = endpoint.match(/\/api\/posts\/(\d+)/)
      if (postIdMatch) {
        const postId = Number.parseInt(postIdMatch[1])
        return mockApiService.mockGetPost(postId) as Promise<ApiResponse<T>>
      }

      // 기본 Mock 응답
      await mockApiService.delay(800)
      return {
        status: "success",
        message: "Mock GET 응답",
        data: {} as T,
      }
    }

    // 실제 API 호출
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 GET 요청:", url)

    const headers = await this.getAuthHeaders()

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        mode: "cors",
        credentials: "omit",
      })

      console.log("📡 GET 응답:", response.status)

      if (response.status === 401 && retryCount < 1) {
        console.log("🔄 401 에러 발생, 토큰 갱신 후 재시도...")
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.get<T>(endpoint, retryCount + 1)
        }
      }

      const responseData = await response.json()
      console.log("📦 GET 데이터:", responseData)

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ GET 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다. CORS 설정을 확인해주세요.")
      }

      throw error
    }
  }

  async post<T>(endpoint: string, data: any, requireAuth = true, retryCount = 0): Promise<ApiResponse<T>> {
    // Mock API 사용
    if (mockApiService.isUsingMockApi()) {
      if (endpoint === "/api/auth/login") {
        return mockApiService.mockLogin(data.email, data.password) as Promise<ApiResponse<T>>
      }

      if (endpoint === "/api/auth/signup") {
        return mockApiService.mockSignup(data) as Promise<ApiResponse<T>>
      }

      if (endpoint === "/api/posts") {
        return mockApiService.mockCreatePost(data) as Promise<ApiResponse<T>>
      }

      // 기본 Mock 응답
      await mockApiService.delay(1000)
      return {
        status: "success",
        message: "Mock POST 응답",
        data: data as T,
      }
    }

    // 실제 API 호출
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 POST 요청:", url)
    console.log("📤 POST 데이터:", data)

    const requestBody = JSON.stringify(data)
    const headers = requireAuth ? await this.getAuthHeaders() : { "Content-Type": "application/json" }

    if (requireAuth) {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.")
      }

      const tokenExpiration = this.getAccessTokenExpiration()
      if (tokenExpiration && Date.now() >= tokenExpiration) {
        console.log("⚠️ 토큰이 만료됨, 갱신 시도...")
        const refreshSuccess = await this.handleTokenRefresh()
        if (!refreshSuccess) {
          throw new Error("토큰 갱신에 실패했습니다. 다시 로그인해주세요.")
        }
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: requestBody,
        mode: "cors",
        credentials: "omit",
      })

      console.log("📡 POST 응답 상태:", response.status)

      if (response.status === 403) {
        const errorText = await response.text()
        console.error("🚫 403 Forbidden:", errorText)
        throw new Error("접근이 거부되었습니다. 권한을 확인해주세요.")
      }

      if (response.status === 401 && requireAuth && retryCount < 1) {
        console.log("🔄 401 에러 발생, 토큰 갱신 후 재시도...")
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.post<T>(endpoint, data, requireAuth, retryCount + 1)
        }
      }

      const contentType = response.headers.get("content-type")
      let responseData: any = {}

      if (contentType && contentType.includes("application/json")) {
        try {
          const responseText = await response.text()
          responseData = JSON.parse(responseText)
        } catch (error) {
          console.error("❌ JSON 파싱 오류:", error)
          responseData = { message: "응답 파싱 오류" }
        }
      } else {
        try {
          const textResponse = await response.text()
          responseData = { message: textResponse || `HTTP ${response.status} 오류` }
        } catch (error) {
          responseData = { message: `HTTP ${response.status} 오류` }
        }
      }

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ POST 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.")
      }

      throw error
    }
  }

  async put<T>(endpoint: string, data: any, retryCount = 0): Promise<ApiResponse<T>> {
    // Mock API는 기본 응답만 제공
    if (mockApiService.isUsingMockApi()) {
      await mockApiService.delay(1000)
      return {
        status: "success",
        message: "Mock PUT 응답",
        data: data as T,
      }
    }

    // 실제 API 호출 로직은 기존과 동일
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 PUT 요청:", url)

    const headers = await this.getAuthHeaders()

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        mode: "cors",
        credentials: "omit",
      })

      if (response.status === 401 && retryCount < 1) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.put<T>(endpoint, data, retryCount + 1)
        }
      }

      const contentType = response.headers.get("content-type")
      let responseData: any = {}

      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json()
        } catch (error) {
          responseData = { message: "응답 파싱 오류" }
        }
      } else {
        try {
          const textResponse = await response.text()
          responseData = { message: textResponse || `HTTP ${response.status} 오류` }
        } catch (error) {
          responseData = { message: `HTTP ${response.status} 오류` }
        }
      }

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ PUT 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다.")
      }

      throw error
    }
  }

  async delete<T>(endpoint: string, retryCount = 0): Promise<ApiResponse<T>> {
    // Mock API는 기본 응답만 제공
    if (mockApiService.isUsingMockApi()) {
      await mockApiService.delay(800)
      return {
        status: "success",
        message: "Mock DELETE 응답",
        data: {} as T,
      }
    }

    // 실제 API 호출 로직
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 DELETE 요청:", url)

    const headers = await this.getAuthHeaders()

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers,
        mode: "cors",
        credentials: "omit",
      })

      if (response.status === 401 && retryCount < 1) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.delete<T>(endpoint, retryCount + 1)
        }
      }

      const contentType = response.headers.get("content-type")
      let responseData: any = {}

      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json()
        } catch (error) {
          responseData = { message: "응답 파싱 오류" }
        }
      } else {
        try {
          const textResponse = await response.text()
          responseData = { message: textResponse || `HTTP ${response.status} 오류` }
        } catch (error) {
          responseData = { message: `HTTP ${response.status} 오류` }
        }
      }

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ DELETE 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다.")
      }

      throw error
    }
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    requireAuth = true,
    retryCount = 0,
  ): Promise<ApiResponse<T>> {
    // Mock API 사용
    if (mockApiService.isUsingMockApi()) {
      await mockApiService.delay(1200)
      return {
        status: "success",
        message: "Mock FormData POST 응답",
        data: {} as T,
      }
    }

    // 실제 API 호출
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 POST FormData 요청:", url)

    const headers: Record<string, string> = {}

    if (requireAuth) {
      const accessToken = authService.getAccessToken()
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        mode: "cors",
        credentials: "omit",
      })

      if (response.status === 401 && requireAuth && retryCount < 1) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.postFormData<T>(endpoint, formData, requireAuth, retryCount + 1)
        }
      }

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ POST FormData 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다.")
      }

      throw error
    }
  }

  async patch<T>(endpoint: string, formData: FormData, options?: any, retryCount = 0): Promise<ApiResponse<T>> {
    // Mock API 사용
    if (mockApiService.isUsingMockApi()) {
      await mockApiService.delay(1000)
      return {
        status: "success",
        message: "Mock PATCH 응답",
        data: {} as T,
      }
    }

    // 실제 API 호출 로직은 기존과 동일
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 PATCH FormData 요청:", url)

    const accessToken = authService.getAccessToken()
    const headers: Record<string, string> = {}

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: formData,
        mode: "cors",
        credentials: "omit",
      })

      if (response.status === 401 && retryCount < 1) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.patch<T>(endpoint, formData, options, retryCount + 1)
        }
      }

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ PATCH FormData 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다.")
      }

      throw error
    }
  }

  async putFormData<T>(endpoint: string, formData: FormData, retryCount = 0): Promise<ApiResponse<T>> {
    // Mock API 사용
    if (mockApiService.isUsingMockApi()) {
      await mockApiService.delay(1000)
      return {
        status: "success",
        message: "Mock PUT FormData 응답",
        data: {} as T,
      }
    }

    // 실제 API 호출 로직
    const url = `${this.baseURL}${endpoint}`
    console.log("🌐 PUT FormData 요청:", url)

    const accessToken = authService.getAccessToken()
    const headers: Record<string, string> = {}

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: formData,
        mode: "cors",
        credentials: "omit",
      })

      if (response.status === 401 && retryCount < 1) {
        const refreshSuccess = await this.handleTokenRefresh()
        if (refreshSuccess) {
          return this.putFormData<T>(endpoint, formData, retryCount + 1)
        }
      }

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || `API 요청 실패: ${response.status}`)
      }

      return responseData
    } catch (error: any) {
      console.error("❌ PUT FormData 요청 오류:", error)

      if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
        throw new Error("네트워크 연결 오류가 발생했습니다.")
      }

      throw error
    }
  }

  // Mock API 사용 여부 확인
  isUsingMockApi(): boolean {
    return mockApiService.isUsingMockApi()
  }

  // 테스트 계정 정보 가져오기
  getTestAccounts() {
    return mockApiService.getTestAccounts()
  }
}

export const apiClient = new ApiClient()

// Mock API 서비스 - v0 환경에서 테스트용
export interface MockApiResponse<T> {
  status: string
  message: string
  data: T
}

export interface MockUser {
  id: number
  email: string
  nickname: string
  profileImage?: string
  createdAt: string
}

export interface MockPost {
  id: number
  title: string
  content: string
  author: MockUser
  createdAt: string
  updatedAt: string
  images?: string[]
  likes: number
  comments: number
}

export interface MockTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
}

class MockApiService {
  private isEnabled: boolean

  constructor() {
    // v0 환경이거나 localhost가 아닌 경우 Mock API 사용
    this.isEnabled =
      typeof window === "undefined" ||
      (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1"))

    console.log("🎭 Mock API 서비스 초기화:", this.isEnabled ? "활성화" : "비활성화")
  }

  // Mock 사용자 데이터
  private mockUsers: MockUser[] = [
    {
      id: 1,
      email: "test@example.com",
      nickname: "테스트유저",
      profileImage: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      email: "user@test.com",
      nickname: "여행러버",
      profileImage: "/placeholder.svg?height=40&width=40",
      createdAt: "2024-01-02T00:00:00Z",
    },
  ]

  // Mock 게시글 데이터
  private mockPosts: MockPost[] = [
    {
      id: 1,
      title: "제주도 3박 4일 여행 후기",
      content: "제주도에서 정말 좋은 시간을 보냈습니다. 한라산 등반도 하고, 맛있는 음식도 많이 먹었어요!",
      author: this.mockUsers[0],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
      likes: 15,
      comments: 8,
    },
    {
      id: 2,
      title: "부산 맛집 투어",
      content: "부산에서 먹은 맛집들을 소개합니다. 특히 해운대 근처 횟집이 정말 맛있었어요!",
      author: this.mockUsers[1],
      createdAt: "2024-01-14T15:20:00Z",
      updatedAt: "2024-01-14T15:20:00Z",
      images: ["/placeholder.svg?height=300&width=400"],
      likes: 23,
      comments: 12,
    },
  ]

  async delay(ms = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async mockLogin(email: string, password: string): Promise<MockApiResponse<{ user: MockUser; tokens: MockTokens }>> {
    console.log("🎭 Mock 로그인 시도:", { email, passwordLength: password.length })

    await this.delay(1500) // 실제 API 호출 시뮬레이션

    // 간단한 로그인 검증
    if (email === "test@example.com" && password === "password") {
      const user = this.mockUsers[0]
      const tokens: MockTokens = {
        accessToken: "mock_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        accessTokenExpiresIn: Date.now() + 60 * 60 * 1000, // 1시간
      }

      return {
        status: "success",
        message: "로그인 성공",
        data: { user, tokens },
      }
    }

    // 다른 테스트 계정들
    const testAccounts = [
      { email: "user@test.com", password: "test123" },
      { email: "admin@example.com", password: "admin123" },
    ]

    const account = testAccounts.find((acc) => acc.email === email && acc.password === password)
    if (account) {
      const user = this.mockUsers.find((u) => u.email === email) || this.mockUsers[1]
      const tokens: MockTokens = {
        accessToken: "mock_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        accessTokenExpiresIn: Date.now() + 60 * 60 * 1000,
      }

      return {
        status: "success",
        message: "로그인 성공",
        data: { user, tokens },
      }
    }

    throw new Error("이메일 또는 비밀번호가 일치하지 않습니다")
  }

  async mockSignup(userData: any): Promise<MockApiResponse<{ user: MockUser; tokens: MockTokens }>> {
    console.log("🎭 Mock 회원가입 시도:", userData)

    await this.delay(2000)

    const newUser: MockUser = {
      id: this.mockUsers.length + 1,
      email: userData.email,
      nickname: userData.nickname || "새로운유저",
      profileImage: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
    }

    this.mockUsers.push(newUser)

    const tokens: MockTokens = {
      accessToken: "mock_access_token_" + Date.now(),
      refreshToken: "mock_refresh_token_" + Date.now(),
      accessTokenExpiresIn: Date.now() + 60 * 60 * 1000,
    }

    return {
      status: "success",
      message: "회원가입 성공",
      data: { user: newUser, tokens },
    }
  }

  async mockGetPosts(): Promise<MockApiResponse<MockPost[]>> {
    console.log("🎭 Mock 게시글 목록 조회")

    await this.delay(800)

    return {
      status: "success",
      message: "게시글 목록 조회 성공",
      data: [...this.mockPosts].reverse(), // 최신순 정렬
    }
  }

  async mockCreatePost(postData: any): Promise<MockApiResponse<MockPost>> {
    console.log("🎭 Mock 게시글 작성:", postData)

    await this.delay(1200)

    const newPost: MockPost = {
      id: this.mockPosts.length + 1,
      title: postData.title,
      content: postData.content,
      author: this.mockUsers[0], // 현재 로그인한 사용자
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: postData.images || [],
      likes: 0,
      comments: 0,
    }

    this.mockPosts.push(newPost)

    return {
      status: "success",
      message: "게시글 작성 성공",
      data: newPost,
    }
  }

  async mockGetPost(id: number): Promise<MockApiResponse<MockPost>> {
    console.log("🎭 Mock 게시글 상세 조회:", id)

    await this.delay(600)

    const post = this.mockPosts.find((p) => p.id === id)
    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다")
    }

    return {
      status: "success",
      message: "게시글 조회 성공",
      data: post,
    }
  }

  async mockRefreshToken(refreshToken: string): Promise<MockApiResponse<MockTokens>> {
    console.log("🎭 Mock 토큰 갱신")

    await this.delay(500)

    const tokens: MockTokens = {
      accessToken: "mock_access_token_refreshed_" + Date.now(),
      refreshToken: "mock_refresh_token_refreshed_" + Date.now(),
      accessTokenExpiresIn: Date.now() + 60 * 60 * 1000,
    }

    return {
      status: "success",
      message: "토큰 갱신 성공",
      data: tokens,
    }
  }

  isUsingMockApi(): boolean {
    return this.isEnabled
  }

  // 테스트 계정 정보 제공
  getTestAccounts() {
    return [
      { email: "test@example.com", password: "password", nickname: "테스트유저" },
      { email: "user@test.com", password: "test123", nickname: "여행러버" },
      { email: "admin@example.com", password: "admin123", nickname: "관리자" },
    ]
  }
}

export const mockApiService = new MockApiService()

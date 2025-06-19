// 기본 응답 타입
export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

// 사용자 관련 타입
export interface User {
  id: number
  email: string
  nickname: string
  profileImage?: string
  role: "ROLE_USER"
  createdAt: string
  updatedAt: string
}

// 인증 관련 타입
export interface LoginRequestDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  grantType: string
  accessToken: string
  accessTokenExpirationTime: number
  refreshToken: string
  refreshTokenExpirationTime: number
}

export interface JoinRequestDto {
  email: string
  password: string
  nickname: string
}

export interface OAuth2JoinRequestDto {
  email: string
  nickname: string
  code: string
}

export interface VerifyCodeDto {
  email: string
  code: string
}

export interface ReissueRequestDto {
  refreshToken: string
}

// 여행 계획 관련 타입
export interface TripPlanDto {
  tripPlanId: number
  planName: string
  startDate: string
  endDate: string
  days: TripDayDto[]
}

export interface TripDayDto {
  tripDayId: number
  dayNumber: number
  date: string
}

export interface TripDayWithDestinationsDto {
  tripDayId: number
  dayNumber: number
  date: string
  destinations: DestinationDto[]
}

export interface DestinationDto {
  id: number
  sequence: number
  transportation?: string
  duration: number
  placeId: string
  type: string
  price?: number
}

export interface CreateTripPlanRequest {
  planName: string
  startDate: string
  endDate: string
}

export interface AddTripDayRequest {
  date: string
}

export interface CreateDestinationRequest {
  tripDayId: number
  sequence: number
  transportation?: string
  duration: number
  placeId: string
  type: string
  price?: number
}

export interface UpdateSequenceRequest {
  tripDayId: number
  orderedDestinationIds: number[]
}

// 비용 관련 타입
export interface CostDto {
  costId: number
  category: string
  otherCost: number
  totalCost: number
}

// 숙박 관련 타입 (여기어때 API)
export interface PlaceDto {
  id: string
  name: string
  latitude: number
  longitude: number
  imageUrl?: string
}

export interface RoomDto {
  roomId: string
  roomName: string
  price: number
  images?: string[]
}

// 관광지 관련 타입 (VisitJeju API)
export interface Place {
  contentsId: string
  name: string
  address?: string
  latitude: number
  longitude: number
  tag?: string
  introduction?: string
  imageUrl?: string
  category?: string
}

// 게시글 관련 타입
export interface PostRequestDto {
  title: string
  content: string
  planId?: number
}

export interface PostUpdateDto {
  title: string
  content: string
  planId?: number
  deleteImages?: number[]
}

export interface PostResponseDto {
  id: number
  title: string
  createdAt: string
  like: number
  views: number
  commentCount: number
  hasImage: boolean
}

export interface PostDetailResponseDto {
  title: string
  images: ImageResponseDto[]
  content: string
  userId: number
  profileImage?: string
  createdAt: string
  like: number
  comments: CommentResponseDto[]
  writer: boolean
  liked: boolean
}

export interface ImageResponseDto {
  id: number
  url: string
}

export interface CommentResponseDto {
  userId: number
  profileImage?: string
  content: string
  createdAt: string
  writer: boolean
}

export interface PageResponseDto {
  currentPage: number
  totalPages: number
  totalElements: number
  posts: PostResponseDto[]
}

// 마이페이지 관련 타입
export interface MypageResponseDto {
  email: string
  nickname: string
  profileImage?: string
  posts: MypagePostDto[]
  comments: CommentResponseDto[]
  favorites: any[]
  friends: FriendResponseDto[]
}

export interface MypagePostDto {
  id: number
  title: string
  content: string
  createdAt: string
  like: number
  commentCount: number
  images: ImageResponseDto[]
}

export interface ProfileUpdateDto {
  nickname?: string
  password?: string
  deleteProfileImage?: boolean
}

// 친구 관련 타입
export interface FriendResponseDto {
  friendId: number
  userId: number
  nickname: string
  profileImage?: string
}

export interface FriendRequestDto {
  requestId: number
  userId: number
  nickname: string
  profileImage?: string
  requestedAt: string
}

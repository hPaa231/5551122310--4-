"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  X,
  UserPlus,
  Users,
  Bell,
  Share2,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Mail,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { friends } from "@/data/friends"

export default function FriendsPage() {
  // 친구 요청 상태 관리
  const [friendRequests] = useState([
    { id: 101, name: "이지은", image: "/placeholder.svg?height=40&width=40" },
    { id: 102, name: "박지민", image: "/placeholder.svg?height=40&width=40" },
  ])

  // 일정 공유 모달 상태 관리
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<{ id: number; name: string } | null>(null)
  const [selectedSchedules, setSelectedSchedules] = useState<number[]>([])

  // 친구 추가 모달 상태 관리
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false)
  const [friendEmail, setFriendEmail] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string; email: string; image: string }>>(
    [],
  )
  const [isSearching, setIsSearching] = useState(false)

  // 공유 받은 일정 상태 관리
  const [sharedSchedules, setSharedSchedules] = useState([
    {
      id: 201,
      title: "부산 맛집 투어 🍽️",
      date: "2024-08-10 - 2024-08-12",
      location: "부산 해운대, 서면",
      sharedBy: {
        id: 1,
        name: "김민준",
        image: "/diverse-professional-profiles.png",
      },
      sharedAt: "2024-04-15",
      status: "pending", // pending, accepted, declined
    },
    {
      id: 202,
      title: "강원도 스키 여행 ⛷️",
      date: "2024-12-24 - 2024-12-26",
      location: "평창, 용평리조트",
      sharedBy: {
        id: 2,
        name: "이서연",
        image: "/contemplative-artist.png",
      },
      sharedAt: "2024-04-14",
      status: "pending",
    },
    {
      id: 203,
      title: "제주도 힐링 여행 🌴",
      date: "2024-05-20 - 2024-05-25",
      location: "제주시, 서귀포시",
      sharedBy: {
        id: 3,
        name: "박지훈",
        image: "/contemplative-man.png",
      },
      sharedAt: "2024-04-10",
      status: "accepted",
    },
  ])

  // 사용자의 일정 목록 (예시 데이터)
  const userSchedules = [
    {
      id: 1,
      title: "제주도 여름 휴가 ✨",
      date: "2024-07-15 - 2024-07-19",
      location: "제주시, 서귀포시",
      duration: "5일 일정",
      image: "/emerald-coast-jeju.png",
    },
    {
      id: 2,
      title: "설악산 단풍 여행 🍁",
      date: "2024-10-20 - 2024-10-22",
      location: "속초시, 양양군",
      duration: "3일 일정",
      image: "/autumnal-vista.png",
    },
    {
      id: 3,
      title: "부산 여행 🌊",
      date: "2024-03-10 - 2024-03-12",
      location: "해운대, 광안리",
      duration: "3일 일정",
      image: "/haeundae-horizon.png",
    },
  ]

  // 일정 선택 토글 함수
  const toggleScheduleSelection = (scheduleId: number) => {
    setSelectedSchedules((prev) =>
      prev.includes(scheduleId) ? prev.filter((id) => id !== scheduleId) : [...prev, scheduleId],
    )
  }

  // 공유하기 버튼 클릭 핸들러
  const handleShareClick = (friend: { id: number; name: string }) => {
    setSelectedFriend(friend)
    setSelectedSchedules([])
    setShareModalOpen(true)
  }

  // 일정 공유 완료 핸들러
  const handleShareComplete = () => {
    // 여기에 실제 공유 로직 구현
    setShareModalOpen(false)
    alert(`${selectedFriend?.name}님에게 ${selectedSchedules.length}개의 일정을 공유했습니다.`)
  }

  // 공유 일정 상태 변경 핸들러
  const handleSharedScheduleAction = (scheduleId: number, action: "accept" | "decline") => {
    setSharedSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, status: action === "accept" ? "accepted" : "declined" } : schedule,
      ),
    )
  }

  // 친구 검색 핸들러
  const handleFriendSearch = () => {
    if (!friendEmail.trim()) return

    setIsSearching(true)

    // 실제로는 API 호출을 통해 검색할 것입니다
    setTimeout(() => {
      // 이메일 검색 결과 예시 (실제로는 API 응답)
      if (friendEmail.includes("@")) {
        setSearchResults([
          {
            id: 201,
            name: "홍길동",
            email: friendEmail,
            image: "/vibrant-street-market.png",
          },
        ])
      } else {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 1000)
  }

  // 친구 요청 보내기 핸들러
  const handleSendFriendRequest = () => {
    // 실제로는 API 호출을 통해 요청을 보낼 것입니다
    alert(`${friendEmail}님에게 친구 요청을 보냈습니다.`)
    setFriendEmail("")
    setSearchResults([])
    setAddFriendModalOpen(false)
  }

  // 공유 일정 개수 계산
  const pendingSharedSchedules = sharedSchedules.filter((s) => s.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">친구</h1>
          </div>

          <Button
            className="bg-black hover:bg-gray-800 text-white rounded-full"
            onClick={() => setAddFriendModalOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" /> 친구 추가
          </Button>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="friends"
              className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4 mr-2" />
              친구 목록
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              친구 요청{" "}
              {friendRequests.length > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                  {friendRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              공유 일정{" "}
              {pendingSharedSchedules > 0 && (
                <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                  {pendingSharedSchedules}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold">내 친구</h2>
                <p className="text-sm text-gray-500 mt-1">총 {friends.length}명의 친구</p>
              </div>

              {friends.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {friends.map((friend) => (
                    <div key={friend.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-200">
                              <Image
                                src={friend.image || "/placeholder.svg?height=48&width=48"}
                                alt={friend.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{friend.name}</p>
                            <p className="text-sm text-gray-500">{friend.status || "위치 정보 없음"}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full px-4"
                          onClick={() => handleShareClick({ id: friend.id, name: friend.name })}
                        >
                          <Share2 className="h-4 w-4 mr-2" /> 공유하기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">아직 친구가 없어요</h3>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto">친구를 추가하고 함께 여행 계획을 세워보세요!</p>
                  <Button
                    className="bg-black hover:bg-gray-800 text-white rounded-full px-6"
                    onClick={() => setAddFriendModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" /> 친구 추가하기
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold">친구 요청</h2>
                <p className="text-sm text-gray-500 mt-1">{friendRequests.length}개의 요청이 있습니다</p>
              </div>

              {friendRequests.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-200">
                            <Image
                              src={request.image || "/placeholder.svg"}
                              alt={request.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.name}</p>
                            <p className="text-sm text-gray-500">친구 요청을 보냈습니다</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
                            <X className="h-4 w-4" />
                            <span className="sr-only">거절</span>
                          </Button>
                          <Button size="sm" className="rounded-full h-10 w-10 p-0 bg-black hover:bg-gray-800">
                            <Check className="h-4 w-4" />
                            <span className="sr-only">수락</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">친구 요청이 없습니다</h3>
                  <p className="text-gray-500 mb-4">새로운 친구 요청이 오면 알려드릴게요!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shared" className="mt-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold">공유 받은 일정</h2>
                <p className="text-sm text-gray-500 mt-1">친구들이 공유한 여행 일정</p>
              </div>

              {sharedSchedules.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sharedSchedules.map((schedule) => (
                    <div key={schedule.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                            <Image
                              src={schedule.sharedBy.image || "/placeholder.svg"}
                              alt={schedule.sharedBy.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-500">
                                <span className="font-bold text-gray-900">{schedule.sharedBy.name}</span>님이 일정을
                                공유했습니다
                              </p>
                              {schedule.status === "accepted" && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                  수락됨
                                </span>
                              )}
                              {schedule.status === "declined" && (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                                  거절됨
                                </span>
                              )}
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <p className="font-medium text-gray-900">{schedule.title}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{schedule.date}</span>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{schedule.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{schedule.sharedAt}에 공유됨</span>
                            </div>
                          </div>
                        </div>

                        {schedule.status === "pending" ? (
                          <div className="flex gap-2 ml-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => handleSharedScheduleAction(schedule.id, "decline")}
                            >
                              거절
                            </Button>
                            <Button
                              size="sm"
                              className="rounded-full bg-black hover:bg-gray-800 text-white"
                              onClick={() => handleSharedScheduleAction(schedule.id, "accept")}
                            >
                              수락
                            </Button>
                          </div>
                        ) : (
                          <Link href={`/schedules/${schedule.id}`} className="ml-auto">
                            <Button variant="outline" size="sm" className="rounded-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              일정 보기
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">공유 받은 일정이 없습니다</h3>
                  <p className="text-gray-500 mb-4">친구들이 일정을 공유하면 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 일정 공유 모달 */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>일정 공유하기</DialogTitle>
            <DialogDescription>{selectedFriend?.name}님에게 공유할 여행 일정을 선택해주세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {userSchedules.length > 0 ? (
              <div className="space-y-3">
                {userSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-3 border rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${
                      selectedSchedules.includes(schedule.id)
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleScheduleSelection(schedule.id)}
                  >
                    <div className="relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={schedule.image || "/placeholder.svg"}
                        alt={schedule.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{schedule.title}</h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{schedule.location}</span>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
                      {selectedSchedules.includes(schedule.id) && <Check className="h-3 w-3 text-black" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">공유할 수 있는 일정이 없습니다.</p>
                <Link href="/schedules/create" className="text-sm text-black underline mt-2 inline-block">
                  새 일정 만들기
                </Link>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShareModalOpen(false)} className="rounded-full">
              취소
            </Button>
            <Button
              onClick={handleShareComplete}
              disabled={selectedSchedules.length === 0}
              className="bg-black hover:bg-gray-800 text-white rounded-full"
            >
              {selectedSchedules.length}개 일정 공유하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 친구 추가 모달 */}
      <Dialog open={addFriendModalOpen} onOpenChange={setAddFriendModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>친구 추가하기</DialogTitle>
            <DialogDescription>이메일 주소로 친구를 검색하고 친구 요청을 보내세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleFriendSearch} disabled={!friendEmail.trim() || isSearching}>
                  {isSearching ? "검색 중..." : "검색"}
                </Button>
              </div>
            </div>

            {isSearching && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">검색 결과</h3>
                {searchResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={result.image || "/placeholder.svg"}
                          alt={result.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-gray-500">{result.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full bg-black hover:bg-gray-800 text-white"
                      onClick={handleSendFriendRequest}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      친구 요청
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && friendEmail && searchResults.length === 0 && (
              <div className="text-center py-4">
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-1">이메일 주소를 다시 확인해주세요.</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">이메일로 초대하기</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    아직 가입하지 않은 친구에게 초대 이메일을 보낼 수 있습니다.
                  </p>
                  <Button
                    variant="link"
                    className="text-black p-0 h-auto text-xs mt-2"
                    onClick={() => {
                      if (friendEmail) {
                        alert(`${friendEmail}님에게 초대 이메일을 보냈습니다.`)
                        setFriendEmail("")
                        setAddFriendModalOpen(false)
                      } else {
                        alert("이메일 주소를 입력해주세요.")
                      }
                    }}
                  >
                    초대 이메일 보내기
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFriendModalOpen(false)} className="rounded-full">
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

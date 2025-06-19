"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Heart, MessageCircle, Eye, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { postService } from "@/lib/post-service"
import { useToast } from "@/hooks/use-toast"
import type { PostResponseDto } from "@/types/api-types"

export default function CommunityPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [posts, setPosts] = useState<PostResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletePostId, setDeletePostId] = useState<number | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // 현재 사용자 정보 로드
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user?.id) {
      setCurrentUserId(user.id)
    }
  }, [])

  // 게시글 목록 로드
  useEffect(() => {
    loadPosts()
  }, [currentPage, searchKeyword])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const response = await postService.getPosts(currentPage, searchKeyword || undefined)

      console.log("📥 게시글 목록 응답:", response)

      if (response.data) {
        setPosts(response.data.posts || [])
        setTotalPages(response.data.totalPages || 0)
        setTotalElements(response.data.totalElements || 0)
        console.log("✅ 게시글 목록 로드 완료:", response.data.posts?.length || 0, "개")
      } else {
        console.error("❌ 응답에 데이터가 없음:", response)
        toast({
          title: "오류",
          description: "게시글을 불러올 수 없습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("게시글 목록 로드 오류:", error)
      toast({
        title: "오류",
        description: "게시글을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0) // 검색 시 첫 페이지로
    loadPosts()
  }

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!deletePostId) return

    try {
      await postService.deletePost(deletePostId)

      toast({
        title: "게시글 삭제",
        description: "게시글이 삭제되었습니다.",
      })

      // 목록 새로고침
      await loadPosts()
      setDeleteDialogOpen(false)
      setDeletePostId(null)
    } catch (error) {
      console.error("게시글 삭제 오류:", error)
      toast({
        title: "오류",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 게시글 삭제 확인
  const confirmDeletePost = (postId: number) => {
    setDeletePostId(postId)
    setDeleteDialogOpen(true)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <p className="text-gray-600 mt-1">여행 경험을 공유하고 소통해보세요</p>
        </div>
        <Button onClick={() => router.push("/community/write")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          글쓰기
        </Button>
      </div>

      {/* 검색 */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="게시글 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
            <Button onClick={() => router.push("/community/write")} className="mt-4">
              첫 번째 게시글 작성하기
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">작성자</p>
                      <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {/* 작성자인 경우 수정/삭제 메뉴 표시 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/community/edit/${post.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => confirmDeletePost(post.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent onClick={() => router.push(`/community/${post.id}`)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">{post.title}</h3>
                    {post.hasImage && <Badge variant="secondary">이미지</Badge>}
                  </div>

                  {/* 게시글 통계 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.like}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.commentCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
            이전
          </Button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum + 1}
              </Button>
            )
          })}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            다음
          </Button>
        </div>
      )}

      {/* 게시글 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

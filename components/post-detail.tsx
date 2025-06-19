"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { postService } from "@/lib/post-service"
import { useToast } from "@/hooks/use-toast"
import type { PostDetailResponseDto, CommentResponseDto } from "@/types/api-types"

interface PostDetailProps {
  postId: number
  currentUserId?: number
}

export default function PostDetail({ postId, currentUserId }: PostDetailProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [post, setPost] = useState<PostDetailResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentText, setEditingCommentText] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null)
  const [submittingComment, setSubmittingComment] = useState(false)

  // 게시글 수정 관련 상태
  const [editPostDialogOpen, setEditPostDialogOpen] = useState(false)
  const [editPostTitle, setEditPostTitle] = useState("")
  const [editPostContent, setEditPostContent] = useState("")
  const [editPostImages, setEditPostImages] = useState<File[]>([])
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false)
  const [updatingPost, setUpdatingPost] = useState(false)

  // 게시글 상세 정보 로드
  useEffect(() => {
    loadPostDetail()
  }, [postId])

  const loadPostDetail = async () => {
    try {
      setLoading(true)
      const response = await postService.getPostById(postId)

      console.log("📥 게시글 상세 응답:", response)

      if (response.data) {
        setPost(response.data)
        console.log("✅ 게시글 데이터 설정 완료:", response.data)
      } else {
        console.error("❌ 응답에 데이터가 없음:", response)
        toast({
          title: "오류",
          description: "게시글을 불러올 수 없습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("게시글 로드 오류:", error)
      toast({
        title: "오류",
        description: "게시글을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!post) return

    try {
      if (post.liked) {
        await postService.unlikePost(postId)
        setPost((prev) =>
          prev
            ? {
                ...prev,
                liked: false,
                like: prev.like - 1,
              }
            : null,
        )
        toast({
          title: "좋아요 취소",
          description: "좋아요를 취소했습니다.",
        })
      } else {
        await postService.likePost(postId)
        setPost((prev) =>
          prev
            ? {
                ...prev,
                liked: true,
                like: prev.like + 1,
              }
            : null,
        )
        toast({
          title: "좋아요",
          description: "게시글에 좋아요를 눌렀습니다.",
        })
      }
    } catch (error) {
      console.error("좋아요 오류:", error)
      toast({
        title: "오류",
        description: "좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 게시글 수정 다이얼로그 열기
  const openEditPostDialog = () => {
    if (!post) return
    setEditPostTitle(post.title)
    setEditPostContent(post.content)
    setEditPostDialogOpen(true)
  }

  // 게시글 수정
  const handlePostUpdate = async () => {
    if (!editPostTitle.trim() || !editPostContent.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setUpdatingPost(true)
      await postService.updatePost(
        postId,
        editPostTitle.trim(),
        editPostContent.trim(),
        undefined, // planId
        undefined, // deleteImages
        editPostImages.length > 0 ? editPostImages : undefined, // newImages
      )

      // 게시글 다시 로드
      await loadPostDetail()
      setEditPostDialogOpen(false)
      setEditPostImages([])

      toast({
        title: "게시글 수정",
        description: "게시글이 성공적으로 수정되었습니다.",
      })
    } catch (error) {
      console.error("게시글 수정 오류:", error)
      toast({
        title: "오류",
        description: "게시글 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setUpdatingPost(false)
    }
  }

  // 게시글 삭제
  const handlePostDelete = async () => {
    try {
      await postService.deletePost(postId)

      toast({
        title: "게시글 삭제",
        description: "게시글이 삭제되었습니다.",
      })

      // 커뮤니티 페이지로 이동
      router.push("/community")
    } catch (error) {
      console.error("게시글 삭제 오류:", error)
      toast({
        title: "오류",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return

    try {
      setSubmittingComment(true)
      await postService.createComment(postId, commentText.trim())

      // 게시글 다시 로드하여 새 댓글 반영
      await loadPostDetail()
      setCommentText("")

      toast({
        title: "댓글 작성",
        description: "댓글이 작성되었습니다.",
      })
    } catch (error) {
      console.error("댓글 작성 오류:", error)
      toast({
        title: "오류",
        description: "댓글 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  // 댓글 수정
  const handleCommentEdit = async (commentId: number) => {
    if (!editingCommentText.trim()) return

    try {
      await postService.updateComment(postId, commentId, editingCommentText.trim())

      // 게시글 다시 로드하여 수정된 댓글 반영
      await loadPostDetail()
      setEditingCommentId(null)
      setEditingCommentText("")

      toast({
        title: "댓글 수정",
        description: "댓글이 수정되었습니다.",
      })
    } catch (error) {
      console.error("댓글 수정 오류:", error)
      toast({
        title: "오류",
        description: "댓글 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 댓글 삭제
  const handleCommentDelete = async () => {
    if (!deleteCommentId) return

    try {
      await postService.deleteComment(postId, deleteCommentId)

      // 게시글 다시 로드하여 삭제된 댓글 반영
      await loadPostDetail()
      setDeleteDialogOpen(false)
      setDeleteCommentId(null)

      toast({
        title: "댓글 삭제",
        description: "댓글이 삭제되었습니다.",
      })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      toast({
        title: "오류",
        description: "댓글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 댓글 수정 시작
  const startEditComment = (comment: CommentResponseDto) => {
    setEditingCommentId(comment.id) // userId 대신 id 사용
    setEditingCommentText(comment.content)
  }

  // 댓글 삭제 확인
  const confirmDeleteComment = (commentId: number) => {
    setDeleteCommentId(commentId)
    setDeleteDialogOpen(true)
  }

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditPostImages(Array.from(e.target.files))
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 게시글 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={post.profileImage || "/placeholder.svg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">작성자</p>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {post.writer && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={openEditPostDialog}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => setDeletePostDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {/* 이미지 */}
          {post.images && post.images.length > 0 && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((image) => (
                <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={image.url || "/placeholder.svg"} alt="게시글 이미지" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* 내용 */}
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center space-x-4 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={handleLikeToggle} className={post.liked ? "text-red-500" : ""}>
              <Heart className={`h-4 w-4 mr-2 ${post.liked ? "fill-current" : ""}`} />
              {post.like}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments.length}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 작성 */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">댓글 작성</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit} disabled={!commentText.trim() || submittingComment}>
                {submittingComment ? "작성 중..." : "댓글 작성"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">댓글 ({post.comments.length})</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">아직 댓글이 없습니다.</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profileImage || "/placeholder.svg"} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">댓글 작성자</p>
                          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleCommentEdit(comment.id)}>
                                저장
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingCommentId(null)
                                  setEditingCommentText("")
                                }}
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        )}
                      </div>
                    </div>
                    {comment.writer && editingCommentId !== comment.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => startEditComment(comment)}>
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteComment(comment.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 게시글 수정 다이얼로그 */}
      <Dialog open={editPostDialogOpen} onOpenChange={setEditPostDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>게시글 수정</DialogTitle>
            <DialogDescription>게시글의 제목과 내용을 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">제목</Label>
              <Input
                id="edit-title"
                value={editPostTitle}
                onChange={(e) => setEditPostTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">내용</Label>
              <Textarea
                id="edit-content"
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="edit-images">새 이미지 추가 (선택사항)</Label>
              <Input id="edit-images" type="file" multiple accept="image/*" onChange={handleImageChange} />
              {editPostImages.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">{editPostImages.length}개의 이미지가 선택되었습니다.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPostDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handlePostUpdate} disabled={updatingPost}>
              {updatingPost ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 게시글 삭제 확인 다이얼로그 */}
      <AlertDialog open={deletePostDialogOpen} onOpenChange={setDeletePostDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handlePostDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 댓글 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleCommentDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { postService } from "@/lib/post-service"
import { useAuth } from "@/context/AuthContext"

const CommunityWritePage = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  // Remove the local state management for authentication
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [loading, setLoading] = useState(true)

  // Add useAuth hook
  const { user, isAuthenticated, loading } = useAuth()

  // Remove the useEffect for checking auth since we're using AuthContext now
  // useEffect(() => {
  //   const checkAuth = () => {
  //     const token = authService.getAccessToken()
  //     const isValid = authService.isTokenValid()
  //     setIsAuthenticated(!!token && isValid)
  //     setLoading(false)
  //   }
  //   checkAuth()
  // }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles])

    const previewURLs = acceptedFiles.map((file) => URL.createObjectURL(file))
    setPreviewImages((prevPreviewImages) => [...prevPreviewImages, ...previewURLs])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".svg"],
    },
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Update the handleSubmit function to check AuthContext authentication
    if (!isAuthenticated || !user) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("🚀 게시글 작성 시작:", { title, content, imageCount: images.length })

      const response = await postService.createPost(title, content, images)
      console.log("✅ 게시글 작성 성공:", response)

      alert("게시글이 성공적으로 등록되었습니다.")
      router.push("/community")
    } catch (error: any) {
      console.error("❌ 게시글 등록 실패:", error)

      if (error.message.includes("403")) {
        alert("게시글 작성 권한이 없습니다. 로그인 상태를 확인해주세요.")
        router.push("/login")
      } else if (error.message.includes("401")) {
        alert("인증이 만료되었습니다. 다시 로그인해주세요.")
        router.push("/login")
      } else {
        alert(`게시글 등록에 실패했습니다: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // 로딩 중이거나 인증되지 않은 경우
  if (loading) {
    return <div className="container mx-auto p-5">로딩 중...</div>
  }

  if (!isAuthenticated) {
    return <div className="container mx-auto p-5">로그인이 필요합니다.</div>
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">커뮤니티 글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 입력 */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="제목을 입력하세요"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* 내용 입력 */}
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="내용을 입력하세요"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">이미지 업로드</label>
          <div
            {...getRootProps()}
            className={`w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <input {...getInputProps()} disabled={isSubmitting} />
            {isDragActive ? (
              <p className="text-center text-gray-500">이미지를 여기에 드롭하세요!</p>
            ) : (
              <p className="text-center text-gray-500">여기를 클릭하거나 이미지를 드래그하여 업로드하세요.</p>
            )}
          </div>

          {/* 이미지 미리보기 */}
          <div className="flex space-x-2">
            {previewImages.map((previewImage, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt={`Uploaded ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? "등록 중..." : "글 작성하기"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommunityWritePage

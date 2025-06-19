"use client"

import { useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { reviews } from "@/data/reviews"

export default function ReviewSection({ destinationId }: { destinationId: number }) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const filteredReviews = reviews.filter((review) => review.destinationId === destinationId)
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">리뷰 ({filteredReviews.length})</h2>

      <div className="mb-6">
        <button className="w-full py-3 border border-black rounded-md font-medium">리뷰 작성하기</button>
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                {review.userImage && (
                  <Image
                    src={review.userImage || "/placeholder.svg"}
                    alt={review.userName}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="ml-3">
                <div className="font-medium">{review.userName}</div>
                <div className="flex items-center">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "currentColor" : "none"}
                        className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm">{review.content}</p>
            {review.images && review.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {review.images.map((image, index) => (
                  <div key={index} className="w-16 h-16 bg-gray-200 rounded-md relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`리뷰 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length > 3 && (
        <button
          className="mt-4 w-full py-2 border rounded-md text-sm"
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          {showAllReviews ? "접기" : `더보기 (${filteredReviews.length - 3})`}
        </button>
      )}
    </div>
  )
}

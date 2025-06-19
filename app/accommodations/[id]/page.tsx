import Image from "next/image"
import Link from "next/link"
import { accommodations } from "@/data/accommodations"
import { MapPin, Star, Share2, Bookmark, Heart, Check } from "lucide-react"

export default function AccommodationDetailPage({ params }: { params: { id: string } }) {
  const accommodation = accommodations.find((a) => a.id.toString() === params.id) || accommodations[0]

  return (
    <div className="max-w-4xl mx-auto bg-white pb-8">
      <div className="relative h-80">
        {accommodation.image && (
          <Image
            src={accommodation.image || "/placeholder.svg?height=320&width=800"}
            alt={accommodation.name}
            fill
            className="object-cover rounded-lg"
          />
        )}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="p-2 bg-white rounded-full shadow-md">
            <Share2 size={20} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md">
            <Bookmark size={20} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold">{accommodation.name}</h1>

        <div className="flex items-center mt-2">
          <Star className="text-yellow-500" size={16} />
          <span className="ml-1 text-lg font-bold">{accommodation.rating}</span>
          <span className="text-sm text-gray-500 ml-1">({accommodation.reviewCount})</span>
        </div>

        <div className="flex items-center mt-4 text-sm text-gray-500">
          <MapPin size={16} className="mr-1" />
          <span>{accommodation.location}</span>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">소개</h2>
          <p className="text-gray-700">{accommodation.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">편의시설</h2>
          <div className="grid grid-cols-2 gap-3">
            {accommodation.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">사진</h2>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-24 bg-gray-200 rounded-md flex items-center justify-center">
                사진
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">위치</h2>
          <div className="h-60 bg-gray-200 rounded-md flex items-center justify-center">지도</div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">1박 기준</span>
              <div className="text-2xl font-bold">{accommodation.price}</div>
            </div>
            <Link
              href="/booking"
              className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600"
            >
              예약하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import Image from "next/image"
import { destinations } from "@/data/destinations"
import { MapPin, Clock, Star, Share2, Bookmark, Heart } from "lucide-react"
import ReviewSection from "@/components/review-section"
import NearbyAttractions from "@/components/nearby-attractions"

export default function AttractionDetailPage({ params }: { params: { id: string } }) {
  const destination = destinations.find((d) => d.id.toString() === params.id) || destinations[0]

  return (
    <div className="max-w-4xl mx-auto bg-white pb-8">
      <div className="relative h-80 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-10">배경사진</div>
        {destination.coverImage && (
          <Image
            src={destination.coverImage || "/placeholder.svg"}
            alt={destination.name}
            fill
            className="object-cover z-20"
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
        <h1 className="text-2xl font-bold">{destination.name}</h1>

        <div className="flex items-center mt-2">
          <Star className="text-yellow-500" size={16} />
          <span className="ml-1 text-lg font-bold">{destination.rating}</span>
          <span className="text-sm text-gray-500 ml-1">({destination.reviewCount})</span>
        </div>

        <div className="flex items-center mt-4 text-sm text-gray-500">
          <MapPin size={16} className="mr-1" />
          <span>{destination.address}</span>
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock size={16} className="mr-1" />
          <span>{destination.hours}</span>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">소개</h2>
          <p className="text-gray-700">{destination.description}</p>
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

        <ReviewSection destinationId={destination.id} />

        <NearbyAttractions currentId={destination.id} />
      </div>
    </div>
  )
}

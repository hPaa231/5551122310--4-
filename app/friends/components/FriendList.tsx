"use client";

import { Share2, Users } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Friend {
  id: number;
  name: string;
  status?: string;
  image?: string;
}

interface FriendListProps {
  friends?: Friend[]; // 💡 옵셔널로 선언 + 아래에서 기본값 처리
  onShareClick: (friend: { id: number; name: string }) => void;
}

export default function FriendList({
  friends = [],
  onShareClick,
}: FriendListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold">내 친구</h2>
        <p className="text-sm text-gray-500 mt-1">
          총 {friends.length}명의 친구
        </p>
      </div>

      {friends.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-200">
                      <Image
                        src={friend.image || "/placeholder.svg"}
                        alt={friend.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{friend.name}</p>
                    <p className="text-sm text-gray-500">
                      {friend.status || "위치 정보 없음"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() =>
                    onShareClick({ id: friend.id, name: friend.name })
                  }
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
          <p className="text-gray-500 mb-6 max-w-xs mx-auto">
            친구를 추가하고 함께 여행 계획을 세워보세요!
          </p>
        </div>
      )}
    </div>
  );
}

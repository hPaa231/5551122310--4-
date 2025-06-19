"use client";

import { X, Check, Bell } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface FriendRequest {
  id: number;
  name: string;
  image: string;
}

export default function FriendRequestList({
  requests,
}: {
  requests: FriendRequest[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold">친구 요청</h2>
        <p className="text-sm text-gray-500 mt-1">
          {requests.length}개의 요청이 있습니다
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-5 hover:bg-gray-50 transition-colors"
            >
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
                    <p className="text-sm text-gray-500">
                      친구 요청을 보냈습니다
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-10 w-10 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">거절</span>
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full h-10 w-10 p-0 bg-black hover:bg-gray-800"
                  >
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
          <p className="text-gray-500 mb-4">
            새로운 친구 요청이 오면 알려드릴게요!
          </p>
        </div>
      )}
    </div>
  );
}

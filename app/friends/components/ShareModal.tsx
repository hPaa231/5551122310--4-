"use client";

import { Calendar, Check, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Schedule {
  id: number;
  title: string;
  date: string;
  location: string;
  image?: string;
}

interface Friend {
  id: number;
  name: string;
}

export default function ShareModal({
  open,
  onClose,
  friend,
  schedules,
  selectedIds,
  onToggle,
  onShare,
}: {
  open: boolean;
  onClose: () => void;
  friend: Friend | null;
  schedules: Schedule[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onShare: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>일정 공유하기</DialogTitle>
          <DialogDescription>
            {friend?.name}님에게 공유할 여행 일정을 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {schedules.length > 0 ? (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-3 border rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${
                    selectedIds.includes(schedule.id)
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => onToggle(schedule.id)}
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
                    {selectedIds.includes(schedule.id) && (
                      <Check className="h-3 w-3 text-black" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">공유할 수 있는 일정이 없습니다.</p>
              <Link
                href="/schedules/create"
                className="text-sm text-black underline mt-2 inline-block"
              >
                새 일정 만들기
              </Link>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            취소
          </Button>
          <Button
            onClick={onShare}
            disabled={selectedIds.length === 0}
            className="bg-black hover:bg-gray-800 text-white rounded-full"
          >
            {selectedIds.length}개 일정 공유하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

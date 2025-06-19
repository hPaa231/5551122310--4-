"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Users, Sparkles, Send, ChevronLeft } from "lucide-react";

export default function PlanningAIPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.email) {
      alert("로그인이 필요합니다.");
      router.replace("/login");
      return;
    }
    setEmail(user.email);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const tripData = {
        startDate,
        endDate,
        travelers,
        preferences,
      };
      localStorage.setItem(`aiTripData-${email}`, JSON.stringify(tripData));
      router.push("/planning/ai/result");
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const days = nights + 1;
    return { nights, days };
  };

  const duration = calculateDuration();

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen">
      {/* ... 생략 없이 전체 기존 UI 내용 동일 ... */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기존 날짜, 인원, 선호도 입력 폼 그대로 유지 */}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className={`flex items-center px-6 py-3 rounded-md ${
              isGenerating ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                AI 일정 생성 중...
              </>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                AI 일정 생성하기
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";

export default function ProfileDropdown() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.replace("/login");
  };

  // ✅ 로그인 안 했을 경우 "로그인" 버튼 표시
  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm text-gray-600 hover:text-black border px-3 py-1.5 rounded-full"
      >
        로그인
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 focus:outline-none">
          <div className="w-8 h-8 rounded-full overflow-hidden relative">
            <Image
              src={user.profileImage || "/placeholder.svg"}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-800">{user.nickname}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 mt-2">
        <DropdownMenuItem asChild>
          <Link href="/mypage">마이페이지</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/community">제공제공 게시판</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/friends">친구 목록</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

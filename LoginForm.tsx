"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/UserContext";

const DEFAULT_PROFILE_IMAGE = "/images/default_profile.png";

type Props = {
  onFindId: () => void;
  onFindPassword: () => void;
};

export default function LoginForm({ onFindId, onFindPassword }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    let storedUsers: any[] = [];

    try {
      const raw = localStorage.getItem("users") || "[]";
      storedUsers = JSON.parse(raw);
    } catch (err) {
      console.error("유저 로딩 오류:", err);
      setErrorMessage("저장된 사용자 정보를 불러오는 데 실패했습니다.");
      return;
    }

    const matchedUser = storedUsers.find(
      (user) =>
        user.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!matchedUser) {
      setErrorMessage("존재하지 않는 계정이거나 비밀번호가 잘못되었습니다.");
      return;
    }

    const savedProfileImage = localStorage.getItem(
      `profileImage-${matchedUser.email}`
    );
    const updatedUser = {
      ...matchedUser,
      profileImage: savedProfileImage || DEFAULT_PROFILE_IMAGE,
    };

    // ✅ 현재 사용자 저장
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // ✅ 사용자 이메일 기준으로 프로필 이미지도 저장
    localStorage.setItem(
      `profileImage-${updatedUser.email}`,
      updatedUser.profileImage
    );

    // ✅ 사용자별 키 초기화 (존재하지 않을 경우만)
    const baseKeys: { key: string; defaultValue: any }[] = [
      { key: `community-posts-${updatedUser.email}`, defaultValue: [] },
      { key: `liked-posts-${updatedUser.email}`, defaultValue: [] },
      { key: `reviews-${updatedUser.email}`, defaultValue: [] },
      { key: `trips-${updatedUser.email}`, defaultValue: [] },
      { key: `friends-${updatedUser.email}`, defaultValue: [] },
      {
        key: `backgroundImage-${updatedUser.email}`,
        defaultValue: "/default-background.jpg",
      },
    ];

    baseKeys.forEach(({ key, defaultValue }) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    });

    toast.success(`${updatedUser.nickname}님 환영합니다!`);
    router.push("/");
  };

  return (
    <form className="space-y-4 mb-6" onSubmit={handleLogin}>
      <div>
        <label className="block text-sm font-medium mb-1">이메일</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-black focus:border-black"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">비밀번호</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-black focus:border-black"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-sm text-gray-600">
            로그인 상태 유지
          </label>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
            onClick={onFindId}
          >
            아이디 찾기
          </button>
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
            onClick={onFindPassword}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[rgba(255,143,0,0.7)] text-white rounded-xl mt-6 hover:bg-[rgba(255,143,0,1)] transition-colors"
      >
        로그인
      </button>
    </form>
  );
}

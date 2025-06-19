"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import PasswordResetDialog from "./PasswordResetDialog";
import IdFinderDialog from "./IdFinderDialog";
import SocialSignupForm from "./SocialSignupForm";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [signupMethod, setSignupMethod] = useState<
    "email" | "kakao" | "google" | null
  >(null);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isIdFinderOpen, setIsIdFinderOpen] = useState(false);

  const checkDuplicate = async (field: "email" | "nickname", value: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.some((user: any) => user[field] === value);
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
    }
  }, [setUser]);

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      <div className="max-w-md mx-auto p-6">
        <div className="flex border-b mb-8">
          <button
            className={`flex-1 py-3 text-center transition-all duration-200 ${
              activeTab === "login"
                ? "text-[rgba(255,143,0,0.7)] text-base font-bold border-b-2 border-[rgba(255,143,0,0.7)]"
                : "text-gray-400 text-sm border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("login")}
          >
            로그인
          </button>

          <button
            className={`flex-1 py-3 text-center transition-all duration-200 ${
              activeTab === "signup"
                ? "text-[rgba(255,143,0,0.7)] text-base font-bold border-b-2 border-[rgba(255,143,0,0.7)]"
                : "text-gray-400 text-sm border-b-2 border-transparent"
            }`}
            onClick={() => {
              setActiveTab("signup");
              setSignupMethod(null);
            }}
          >
            회원가입
          </button>
        </div>

        {activeTab === "login" && (
          <>
            <LoginForm
              onFindId={() => setIsIdFinderOpen(true)}
              onFindPassword={() => setIsPasswordResetOpen(true)}
            />
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full py-3 border-2 border-gray-300 rounded-md flex items-center justify-center transition-colors hover:border-[rgba(255,143,0,0.8)]">
                <img
                  src="/kakao-friends-group.png"
                  alt="카카오"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                카카오로 로그인
              </button>
              <button className="w-full py-3 border-2 border-gray-300 rounded-md flex items-center justify-center transition-colors hover:border-[rgba(255,143,0,0.8)]">
                <img
                  src="/colorful-search-bar.png"
                  alt="구글"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                구글로 로그인
              </button>
            </div>
          </>
        )}

        {activeTab === "signup" && (
          <>
            {!signupMethod ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center mb-7">
                  회원가입 방법 선택
                </h2>
                <button
                  className="w-full py-3 border-2 rounded-md flex justify-center items-center transition-colors hover:border-[rgba(255,143,0,0.8)]"
                  onClick={() => setSignupMethod("kakao")}
                >
                  <img
                    src="/kakao-friends-group.png"
                    alt="카카오"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  카카오로 가입하기
                </button>
                <button
                  className="w-full py-3 border-2 rounded-md flex justify-center items-center transition-colors hover:border-[rgba(255,143,0,0.7)]"
                  onClick={() => setSignupMethod("google")}
                >
                  <img
                    src="/colorful-search-bar.png"
                    alt="구글"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  구글로 가입하기
                </button>
                <button
                  className="w-full py-3 border-2 rounded-md flex justify-center items-center transition-colors hover:border-[rgba(255,143,0,0.7)]"
                  onClick={() => setSignupMethod("email")}
                >
                  이메일로 가입하기
                </button>
              </div>
            ) : signupMethod === "email" ? (
              <SignupForm
                onSignupComplete={() => {
                  setSignupMethod(null);
                  setActiveTab("login");
                }}
                checkDuplicate={checkDuplicate}
              />
            ) : (
              <SocialSignupForm provider={signupMethod} />
            )}
          </>
        )}
      </div>

      <PasswordResetDialog
        open={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
      />
      <IdFinderDialog
        open={isIdFinderOpen}
        onClose={() => setIsIdFinderOpen(false)}
      />
    </div>
  );
}

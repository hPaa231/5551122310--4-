"use client";

import { useState, useEffect } from "react";

type Props = {
  emailFront: string;
  setEmailFront: (value: string) => void;
  emailDomain: string;
  setEmailDomain: (value: string) => void;
  customDomain: string;
  setCustomDomain: (value: string) => void;
};

export default function EmailSelector({
  emailFront,
  setEmailFront,
  emailDomain,
  setEmailDomain,
  customDomain,
  setCustomDomain,
}: Props) {
  const [isCustom, setIsCustom] = useState(emailDomain === "custom");

  useEffect(() => {
    setIsCustom(emailDomain === "custom");
  }, [emailDomain]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">이메일</label>
      <div className="flex gap-2 items-center">
        {/* 이메일 앞부분 */}
        <input
          type="text"
          maxLength={20}
          className="w-1/2 p-3 border border-gray-300 rounded-md"
          value={emailFront}
          onChange={(e) => setEmailFront(e.target.value)}
        />
        <span>@</span>

        {/* 도메인 선택 or 직접 입력 */}
        {isCustom ? (
          <input
            type="text"
            placeholder="도메인 입력"
            className="w-1/2 p-3 border border-gray-300 rounded-md"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
          />
        ) : (
          <select
            className="w-1/2 p-3 border border-gray-300 rounded-md"
            value={emailDomain}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "custom") {
                setEmailDomain("custom");
                setCustomDomain(""); // 초기화
              } else {
                setEmailDomain(val);
              }
            }}
          >
            <option value="">도메인 선택</option>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
            <option value="hanmail.net">hanmail.net</option>
            <option value="hotmail.com">hotmail.com</option>
            <option value="nate.com">nate.com</option>
            <option value="yahoo.co.kr">yahoo.co.kr</option>
            <option value="custom">직접 입력</option>
          </select>
        )}
      </div>
    </div>
  );
}

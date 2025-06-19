"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const DEFAULT_PROFILE_IMAGE = "/images/default_profile.png";

interface User {
  email: string;
  nickname: string;
  profileImage?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ✅ 개발환경일 경우 자동 로그인 방지를 위해 user 초기화
    if (process.env.NODE_ENV === "development") {
      localStorage.removeItem("user");
    }

    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        if (parsed.email && parsed.nickname) {
          const fallbackImage = localStorage.getItem(`profileImage-${parsed.email}`) || DEFAULT_PROFILE_IMAGE;
          setUser({ ...parsed, profileImage: fallbackImage });
        }
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

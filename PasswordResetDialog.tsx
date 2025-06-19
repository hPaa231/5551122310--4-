"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PasswordResetDialog({ open, onClose }: Props) {
  const [step, setStep] = useState<"email" | "verification" | "newPassword">(
    "email"
  );
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequest = async () => {
    const res = await fetch("/api/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });

    if (res.ok) {
      alert("인증코드가 전송되었습니다.");
      setStep("verification");
    } else {
      const data = await res.json();
      alert(`오류: ${data.error}`);
    }
  };

  const handleVerify = async () => {
    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, code: verificationCode }),
    });

    if (res.ok) {
      alert("인증 성공");
      setStep("newPassword");
    } else {
      const data = await res.json();
      alert(`인증 실패: ${data.error}`);
    }
  };

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, newPassword }),
    });

    if (res.ok) {
      alert("비밀번호가 변경되었습니다.");
      onClose();
      setStep("email");
    } else {
      const data = await res.json();
      alert(`오류: ${data.error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 찾기</DialogTitle>
        </DialogHeader>

        {step === "email" && (
          <>
            <p className="text-sm text-gray-500">
              가입하신 이메일 주소를 입력하시면 인증코드를 보내드립니다.
            </p>
            <Label htmlFor="reset-email">이메일</Label>
            <Input
              id="reset-email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="example@email.com"
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleRequest}>인증코드 받기</Button>
            </DialogFooter>
          </>
        )}

        {step === "verification" && (
          <>
            <p className="text-sm text-gray-500">
              {resetEmail}로 전송된 인증코드를 입력해주세요.
            </p>
            <Label>인증코드</Label>
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="6자리 인증코드"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("email")}>
                이전
              </Button>
              <Button onClick={handleVerify}>확인</Button>
            </DialogFooter>
          </>
        )}

        {step === "newPassword" && (
          <>
            <p className="text-sm text-gray-500">새 비밀번호를 입력해주세요.</p>
            <Label>새 비밀번호</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8자 이상"
            />
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("verification")}>
                이전
              </Button>
              <Button onClick={handleReset}>비밀번호 변경</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

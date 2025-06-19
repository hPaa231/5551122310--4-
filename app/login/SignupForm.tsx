"use client"

import type React from "react"
import { useState } from "react"
import { authService } from "@/lib/auth-service"

export default function SignupForm() {
  // 이메일 (아이디 겸 인증용)
  const [emailFront, setEmailFront] = useState("")
  const [emailDomain, setEmailDomain] = useState("")
  const [customDomain, setCustomDomain] = useState("")

  const [nickname, setNickname] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // 🆕 이메일 인증 선택 옵션
  const [useEmailVerification, setUseEmailVerification] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState("")
  const [codeSentTime, setCodeSentTime] = useState<Date | null>(null)

  // 현재 입력된 전체 이메일 계산
  const getCurrentEmail = () => {
    const domainToUse = emailDomain === "custom" ? customDomain.trim().toLowerCase() : emailDomain.trim().toLowerCase()
    return `${emailFront.trim().toLowerCase()}@${domainToUse}`
  }

  // 이메일 중복 체크
  const checkEmailDuplicate = async (email: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      return users.some((user: any) => user.email === email)
    } catch (error) {
      console.error("이메일 중복 체크 오류:", error)
      return false
    }
  }

  // 닉네임 중복 체크
  const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      return users.some((user: any) => user.nickname === nickname)
    } catch (error) {
      console.error("닉네임 중복 체크 오류:", error)
      return false
    }
  }

  // 이메일 인증 코드 전송
  const sendVerificationCode = async () => {
    const currentEmail = getCurrentEmail()

    if (!emailFront || (!emailDomain && !customDomain)) {
      setError("이메일을 완전히 입력해주세요.")
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(currentEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      console.log("📧 인증 코드 전송 요청:", currentEmail)
      const sendTime = new Date()
      console.log("📧 코드 발송 시간:", sendTime.toISOString())

      const response = await authService.sendEmailCode(currentEmail)
      console.log("📥 인증 코드 전송 응답:", response)

      setCodeSentTime(sendTime)
      setShowVerification(true)
      setVerificationCode("")
      alert("인증 코드가 이메일로 전송되었습니다.")
    } catch (error: any) {
      console.error("인증 코드 전송 오류:", error)
      if (error.message?.includes("409") || error.message?.includes("Conflict")) {
        setError("이미 사용 중인 이메일입니다.")
      } else {
        setError("인증 코드 전송에 실패했습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 이메일 인증 코드 확인
  const verifyEmail = async () => {
    const currentEmail = getCurrentEmail()
    const verifyTime = new Date()

    console.log("🔍 인증 시작 - 상세 정보:")
    console.log("- 인증 시도 시간:", verifyTime.toISOString())
    console.log("- 코드 발송 시간:", codeSentTime?.toISOString())
    console.log(
      "- 경과 시간(분):",
      codeSentTime ? (verifyTime.getTime() - codeSentTime.getTime()) / 1000 / 60 : "알 수 없음",
    )
    console.log("- 입력된 이메일:", currentEmail)
    console.log("- 입력된 코드:", verificationCode)

    if (!currentEmail || !verificationCode) {
      setError("인증 코드를 입력해주세요.")
      return
    }

    // 인증 코드 형식 검증
    const cleanCode = verificationCode.trim()
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setError("인증 코드는 6자리 숫자여야 합니다.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const response = await authService.verifyEmailCode(currentEmail, cleanCode)
      console.log("📥 인증 확인 성공:", response)

      setEmailVerified(true)
      setVerifiedEmail(currentEmail)
      setShowVerification(false)
      setVerificationCode("")
      alert("이메일 인증이 완료되었습니다.")
    } catch (error: any) {
      console.error("❌ 인증 실패:", error)

      // 코드 만료 시간 체크 (일반적으로 5분)
      if (codeSentTime) {
        const elapsedMinutes = (verifyTime.getTime() - codeSentTime.getTime()) / 1000 / 60
        if (elapsedMinutes > 5) {
          setError("인증 코드가 만료되었습니다. 새로운 인증 코드를 요청해주세요.")
          setShowVerification(false)
          return
        }
      }

      if (error.message?.includes("만료")) {
        setError("인증 코드가 만료되었습니다. 새로운 인증 코드를 요청해주세요.")
        setShowVerification(false)
      } else if (error.message?.includes("올바르지 않")) {
        setError("인증 코드가 올바르지 않습니다. 다시 확인해주세요.")
      } else {
        setError("인증 확인에 실패했습니다. 서버 문제일 수 있습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    const currentEmail = getCurrentEmail()

    // 기본 유효성 검사
    if (
      !name ||
      !currentEmail ||
      !password ||
      !confirmPassword ||
      !nickname ||
      !birthYear ||
      !birthMonth ||
      !birthDay
    ) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(currentEmail)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return
    }

    if (password.length < 8) {
      setError("비밀번호는 8자리 이상이어야 합니다.")
      return
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    // 🆕 이메일 인증을 선택한 경우에만 인증 확인
    if (useEmailVerification && !emailVerified) {
      setError("이메일 인증을 완료해주세요.")
      return
    }

    // 인증된 이메일과 현재 이메일이 다른 경우 체크 (인증을 사용하는 경우에만)
    if (useEmailVerification && emailVerified && verifiedEmail !== currentEmail) {
      setError("인증된 이메일과 입력한 이메일이 다릅니다. 다시 인증해주세요.")
      setEmailVerified(false)
      setShowVerification(false)
      setVerifiedEmail("")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // 중복 체크
      const emailExists = await checkEmailDuplicate(currentEmail)
      const nicknameExists = await checkNicknameDuplicate(nickname)

      if (emailExists) {
        setError("이미 사용 중인 이메일입니다.")
        return
      }

      if (nicknameExists) {
        setError("이미 사용 중인 닉네임입니다.")
        return
      }

      console.log("📝 회원가입 시도:", { email: currentEmail, nickname, useEmailVerification })

      // 회원가입 (인증 여부와 관계없이 진행)
      const response = await authService.join(currentEmail, password, nickname)
      console.log("📥 회원가입 응답:", response)

      alert("가입이 완료되었습니다!")
      window.location.reload()
    } catch (error: any) {
      console.error("회원가입 오류:", error)
      if (error.message?.includes("409") || error.message?.includes("Conflict")) {
        setError("이메일 또는 닉네임이 중복되었습니다.")
      } else if (error.message?.includes("403") || error.message?.includes("Forbidden")) {
        setError("이메일이 인증되지 않았습니다. 다시 인증해주세요.")
        if (useEmailVerification) {
          setEmailVerified(false)
          setVerifiedEmail("")
        }
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="emailFront" className="block text-sm font-medium text-gray-900 mb-2">
            이메일 (아이디)
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="emailFront"
              name="emailFront"
              type="text"
              autoComplete="email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
              value={emailFront}
              onChange={(e) => {
                setEmailFront(e.target.value)
                // 이메일이 변경되면 인증 상태 초기화
                if (emailVerified) {
                  setEmailVerified(false)
                  setShowVerification(false)
                  setVerifiedEmail("")
                  setCodeSentTime(null)
                }
              }}
              placeholder="example"
              disabled={isLoading}
            />
            <span className="text-gray-500 text-lg">@</span>
            <div className="flex-1">
              {emailDomain === "custom" ? (
                <input
                  id="customDomain"
                  name="customDomain"
                  type="text"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value)
                    // 도메인이 변경되면 인증 상태 초기화
                    if (emailVerified) {
                      setEmailVerified(false)
                      setShowVerification(false)
                      setVerifiedEmail("")
                      setCodeSentTime(null)
                    }
                  }}
                  placeholder="도메인 입력"
                  disabled={isLoading}
                />
              ) : (
                <select
                  id="emailDomain"
                  name="emailDomain"
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={emailDomain}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === "custom") {
                      setEmailDomain("custom")
                      setCustomDomain("")
                    } else {
                      setEmailDomain(val)
                    }
                    // 도메인이 변경되면 인증 상태 초기화
                    if (emailVerified) {
                      setEmailVerified(false)
                      setShowVerification(false)
                      setVerifiedEmail("")
                      setCodeSentTime(null)
                    }
                  }}
                  disabled={isLoading}
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

          <p className="text-sm text-gray-500 mt-2">로그인 아이디로 사용됩니다</p>

          {/* 🆕 이메일 인증 선택 옵션 */}
          <div className="mt-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useEmailVerification}
                onChange={(e) => {
                  setUseEmailVerification(e.target.checked)
                  if (!e.target.checked) {
                    // 인증 비활성화 시 관련 상태 초기화
                    setEmailVerified(false)
                    setShowVerification(false)
                    setVerifiedEmail("")
                    setVerificationCode("")
                    setCodeSentTime(null)
                  }
                }}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">이메일 인증하기 (선택사항)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">체크하면 이메일로 인증 코드를 받아 본인 확인을 할 수 있습니다</p>
          </div>

          {/* 이메일 인증 관련 UI (선택한 경우에만 표시) */}
          {useEmailVerification && !emailVerified && emailFront && (emailDomain || customDomain) && (
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={isLoading}
              className="mt-3 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm"
            >
              {isLoading ? "전송 중..." : "인증코드 발송"}
            </button>
          )}

          {useEmailVerification && showVerification && (
            <div className="mt-3 space-y-3">
              <div className="text-sm text-gray-600">
                {codeSentTime && <p>코드 발송 시간: {codeSentTime.toLocaleTimeString()} (유효시간: 5분)</p>}
              </div>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                autoComplete="one-time-code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증 코드를 입력하세요"
                disabled={isLoading}
                maxLength={6}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={verifyEmail}
                  disabled={isLoading || !verificationCode}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                >
                  {isLoading ? "확인 중..." : "인증 확인"}
                </button>
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 text-sm"
                >
                  재전송
                </button>
              </div>
            </div>
          )}

          {useEmailVerification && emailVerified && verifiedEmail && (
            <div className="mt-2 text-green-600 text-sm">
              ✅ <strong>{verifiedEmail}</strong> 인증이 완료되었습니다.
            </div>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            이름
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요 (8자 이상)"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 재입력하세요"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-900 mb-2">
            닉네임
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            autoComplete="username"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="birthYear" className="block text-sm font-medium text-gray-900 mb-2">
            생년월일
          </label>
          <div className="flex gap-2">
            <input
              id="birthYear"
              name="birthYear"
              type="text"
              autoComplete="bday-year"
              placeholder="년도"
              maxLength={4}
              className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              disabled={isLoading}
            />
            <input
              id="birthMonth"
              name="birthMonth"
              type="text"
              autoComplete="bday-month"
              placeholder="월"
              maxLength={2}
              className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              disabled={isLoading}
            />
            <input
              id="birthDay"
              name="birthDay"
              type="text"
              autoComplete="bday-day"
              placeholder="일"
              maxLength={2}
              className="w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </div>
  )
}

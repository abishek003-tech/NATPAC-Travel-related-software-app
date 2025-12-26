"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Mail, Lock, ShieldCheck, Eye, EyeOff, KeyRound, AlertCircle, Smartphone } from "lucide-react"

export default function AdminLoginPage() {
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  })

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    if (!show2FA) {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (formData.email === "admin1" && formData.password === "admin1@123") {
        setIsLoading(false)
        setShow2FA(true)
      } else {
        setLoginError("Invalid admin credentials")
        setIsLoading(false)
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (formData.twoFactorCode === "123456") {
        sessionStorage.setItem("authType", "admin")
        sessionStorage.setItem("username", "Administrator")
        setIsLoading(false)
        router.push("/admin-home")
      } else {
        setLoginError("Invalid verification code. Please try again.")
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/images/kerala-bg-new.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/15 to-black/50" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col p-3 sm:p-5">
        <Link href="/" className="mb-4 sm:mb-6 ios-fade-in">
          <button className="flex items-center gap-1 text-white/95 hover:text-white ios-transition active:scale-95 p-2 -ml-2">
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
            <span className="text-[16px] sm:text-[17px] font-normal">Back</span>
          </button>
        </Link>

        <div className="flex-1 flex items-center justify-center pb-6 sm:pb-8">
          <div
            className={`w-full max-w-[340px] sm:max-w-[400px] transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div
              className="relative rounded-[24px] sm:rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-white/30 p-6 sm:p-8 overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
                WebkitBackdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <div className="absolute inset-0 rounded-[24px] sm:rounded-[28px] border border-white/40 pointer-events-none" />

              <div className="text-center space-y-4 sm:space-y-5 mb-6 sm:mb-8 ios-slide-up">
                <div className="flex justify-center">
                  <div
                    className={`h-[64px] w-[64px] sm:h-[72px] sm:w-[72px] rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 ${
                      show2FA ? "scale-110" : "scale-100"
                    }`}
                    style={{
                      background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                    }}
                  >
                    {show2FA ? (
                      <KeyRound className="h-8 w-8 sm:h-9 sm:w-9 text-white" strokeWidth={2.5} />
                    ) : (
                      <ShieldCheck className="h-8 w-8 sm:h-9 sm:w-9 text-white" strokeWidth={2.5} />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <h1
                    className="text-[28px] sm:text-[34px] font-semibold text-gray-900 tracking-tight leading-[1.2]"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif", letterSpacing: "-0.02em" }}
                  >
                    {show2FA ? "Verify Identity" : "Admin Portal"}
                  </h1>
                  <p
                    className="text-[15px] sm:text-[17px] text-gray-700/80"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {show2FA ? "Enter your 6-digit authentication code" : "Secure access for administrators"}
                  </p>
                  {show2FA && (
                    <div className="flex items-center justify-center gap-2 pt-2 ios-fade-in">
                      <Smartphone className="h-4 w-4 text-gray-600" strokeWidth={2} />
                      <p
                        className="text-[13px] sm:text-[15px] text-gray-600 font-medium"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Code sent to +91 971-586-5775
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {loginError && (
                <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-[12px] sm:rounded-[14px] bg-red-50/80 border border-red-200/60 animate-in slide-in-from-top-2">
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {loginError}
                  </p>
                </div>
              )}

              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                {!show2FA ? (
                  <>
                    <div className="space-y-2 sm:space-y-3 ios-slide-up" style={{ animationDelay: "0.1s" }}>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                          strokeWidth={2}
                        />
                        <input
                          type="text"
                          placeholder="Admin Username"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value })
                            setLoginError("")
                          }}
                          className="w-full h-[46px] sm:h-[50px] pl-10 sm:pl-12 pr-4 text-[16px] sm:text-[17px] text-gray-900 placeholder:text-gray-500 rounded-[12px] sm:rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-purple-500/30 ios-transition"
                          style={{
                            background: "rgba(255, 255, 255, 0.5)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            fontFamily: "SF Pro Text, system-ui, sans-serif",
                          }}
                        />
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                          strokeWidth={2}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value })
                            setLoginError("")
                          }}
                          className="w-full h-[46px] sm:h-[50px] pl-10 sm:pl-12 pr-11 sm:pr-12 text-[16px] sm:text-[17px] text-gray-900 placeholder:text-gray-500 rounded-[12px] sm:rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-purple-500/30 ios-transition"
                          style={{
                            background: "rgba(255, 255, 255, 0.5)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            fontFamily: "SF Pro Text, system-ui, sans-serif",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 ios-transition active:scale-90"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" strokeWidth={2} />
                          ) : (
                            <Eye className="h-5 w-5" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="ios-fade-in" style={{ animationDelay: "0.15s" }}>
                      <div
                        className="rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-center"
                        style={{
                          background: "rgba(59, 130, 246, 0.15)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                        }}
                      >
                        <p
                          className="text-[14px] sm:text-[15px] text-blue-700 font-medium"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          Two-factor authentication enabled
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 sm:space-y-3 ios-scale-in">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={formData.twoFactorCode}
                        onChange={(e) => {
                          setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, "") })
                          setLoginError("")
                        }}
                        className="w-full h-[50px] sm:h-[56px] px-4 text-[24px] sm:text-[28px] text-gray-900 placeholder:text-gray-400 text-center rounded-[12px] sm:rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-purple-500/30 ios-transition tracking-[0.3em]"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          fontFamily: "SF Mono, monospace",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShow2FA(false)
                        setLoginError("")
                      }}
                      className="text-[14px] sm:text-[15px] text-purple-600 hover:text-purple-700 font-normal ios-transition active:opacity-70"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      Use different account
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[46px] sm:h-[50px] rounded-[12px] sm:rounded-[14px] text-white text-[16px] sm:text-[17px] font-semibold shadow-lg shadow-purple-500/30 ios-button-press mt-5 sm:mt-6 relative overflow-hidden disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                    fontFamily: "SF Pro Text, system-ui, sans-serif",
                    animationDelay: "0.2s",
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {show2FA ? "Verifying..." : "Authenticating..."}
                    </span>
                  ) : (
                    <span>{show2FA ? "Verify & Access" : "Continue to 2FA"}</span>
                  )}
                </button>
              </form>

              <div
                className="pt-5 sm:pt-6 border-t border-gray-400/30 mt-5 sm:mt-6 ios-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span
                    className="text-[12px] sm:text-[13px] text-gray-600"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    Protected by advanced security
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

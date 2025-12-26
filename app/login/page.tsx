"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loginError, setLoginError] = useState("")
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const router = useRouter()

  const googleAccounts = [
    {
      email: "kerala.tourism@gmail.com",
      name: "Kerala Tourism",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Kerala Tourism",
    },
    {
      email: "user@kerala.com",
      name: "Kerala User",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Kerala User",
    },
    {
      email: "demo@example.com",
      name: "Demo Account",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Demo Account",
    },
  ]

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return value.length < 2 ? "Name must be at least 2 characters" : ""
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email address" : ""
      case "password":
        return value.length < 8 ? "Password must be at least 8 characters" : ""
      default:
        return ""
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLoginError("")
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name as keyof typeof formData])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleGoogleLogin = async (account: { email: string; name: string }) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    sessionStorage.setItem("authType", "user")
    sessionStorage.setItem("username", account.name)
    sessionStorage.setItem("userEmail", account.email)

    setIsLoading(false)
    router.push("/home")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach((key) => {
      if (isSignUp || key !== "name") {
        const error = validateField(key, formData[key as keyof typeof formData])
        if (error) newErrors[key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!isSignUp) {
      if (formData.email === "kerala" && formData.password === "User@123") {
        sessionStorage.setItem("authType", "user")
        sessionStorage.setItem("username", "Kerala User")
        setIsLoading(false)
        router.push("/home")
        return
      } else {
        setLoginError("Invalid username or password")
        setIsLoading(false)
        return
      }
    }

    sessionStorage.setItem("authType", "user")
    sessionStorage.setItem("username", formData.name)
    setIsLoading(false)
    router.push("/home")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    setIsSignUp(!isSignUp)
    setErrors({})
    setTouched({})
    setLoginError("")
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
        <div className="absolute inset-0 bg-black/25 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/40" />
      </div>

      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGoogleModal(false)} />
          <div
            className="relative w-full max-w-[340px] sm:max-w-md rounded-[24px] sm:rounded-[28px] shadow-2xl animate-in zoom-in-95 duration-300"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "saturate(180%) blur(25px)",
              WebkitBackdropFilter: "saturate(180%) blur(25px)",
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  className="text-[20px] sm:text-[24px] font-semibold text-gray-900"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  Choose an account
                </h2>
                <button
                  onClick={() => setShowGoogleModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 ios-transition active:scale-90"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <p
                className="text-[14px] sm:text-[15px] text-gray-600 mb-4 sm:mb-6"
                style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
              >
                to continue to Kerala Tourism
              </p>

              <div className="space-y-2">
                {googleAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => handleGoogleLogin(account)}
                    disabled={isLoading}
                    className="w-full p-3 sm:p-4 rounded-[12px] sm:rounded-[14px] flex items-center gap-3 sm:gap-4 hover:bg-gray-100/80 ios-transition active:scale-98 disabled:opacity-60"
                    style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <img
                      src={account.avatar || "/placeholder.svg"}
                      alt={account.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <p
                        className="text-[14px] sm:text-[15px] font-medium text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {account.name}
                      </p>
                      <p
                        className="text-[12px] sm:text-[13px] text-gray-600"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {account.email}
                      </p>
                    </div>
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-[12px] sm:rounded-[14px] bg-blue-50/60 border border-blue-200/40">
                <p
                  className="text-[12px] sm:text-[13px] text-gray-700 text-center"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  To continue, Google will share your name, email address, and profile picture with Kerala Tourism.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              className="relative rounded-[24px] sm:rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/30 p-6 sm:p-8 overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
                WebkitBackdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <div className="absolute inset-0 rounded-[24px] sm:rounded-[28px] border border-white/40 pointer-events-none" />

              <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-8 ios-slide-up">
                <h1
                  className="text-[28px] sm:text-[34px] font-semibold text-gray-900 tracking-tight leading-[1.2]"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif", letterSpacing: "-0.02em" }}
                >
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p
                  className="text-[15px] sm:text-[17px] text-gray-700/80"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  {isSignUp ? "Join us to explore Kerala" : "Sign in to continue"}
                </p>
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
                {isSignUp && (
                  <div className="space-y-2 sm:space-y-3 ios-slide-up" style={{ animationDelay: "0.1s" }}>
                    <div className="relative">
                      <User
                        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                        strokeWidth={2}
                      />
                      <Input
                        id="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className={`w-full h-[46px] sm:h-[50px] pl-10 sm:pl-12 pr-4 text-[16px] sm:text-[17px] text-gray-900 placeholder:text-gray-500 rounded-[12px] sm:rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ios-transition ${
                          errors.name && touched.name
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200/60 focus:border-blue-500 focus:ring-blue-500/20"
                        }`}
                      />
                      {touched.name && (
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                          {errors.name ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.name && touched.name && (
                      <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                <div
                  className="space-y-2 sm:space-y-3 ios-slide-up"
                  style={{ animationDelay: isSignUp ? "0.15s" : "0.1s" }}
                >
                  <div className="relative">
                    <Mail
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                      strokeWidth={2}
                    />
                    <Input
                      id="email"
                      type="text"
                      placeholder={isSignUp ? "Email" : "Username"}
                      value={formData.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-full h-[46px] sm:h-[50px] pl-10 sm:pl-12 pr-4 text-[16px] sm:text-[17px] text-gray-900 placeholder:text-gray-500 rounded-[12px] sm:rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ios-transition`}
                    />
                    {touched.email && isSignUp && (
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                        {errors.email ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Lock
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                      strokeWidth={2}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleFieldChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className={`w-full h-[46px] sm:h-[50px] pl-10 sm:pl-12 pr-11 sm:pr-12 text-[16px] sm:text-[17px] text-gray-900 placeholder:text-gray-500 rounded-[12px] sm:rounded-[14px] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ios-transition`}
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
                  {errors.password && touched.password && (
                    <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                      {errors.password}
                    </p>
                  )}
                  {isSignUp && formData.password && (
                    <div className="space-y-1 animate-in slide-in-from-top-1">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength
                                ? passwordStrength === 1
                                  ? "bg-red-500"
                                  : passwordStrength === 2
                                    ? "bg-orange-500"
                                    : passwordStrength === 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        {passwordStrength === 0 && "Very weak"}
                        {passwordStrength === 1 && "Weak"}
                        {passwordStrength === 2 && "Fair"}
                        {passwordStrength === 3 && "Good"}
                        {passwordStrength === 4 && "Strong"}
                      </p>
                    </div>
                  )}
                </div>

                {!isSignUp && (
                  <div className="flex justify-end ios-fade-in" style={{ animationDelay: "0.15s" }}>
                    <button
                      type="button"
                      className="text-[14px] sm:text-[15px] text-blue-600 hover:text-blue-700 font-normal ios-transition active:opacity-70"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[46px] sm:h-[50px] rounded-[12px] sm:rounded-[14px] text-white text-[16px] sm:text-[17px] font-semibold shadow-lg shadow-blue-500/30 ios-button-press mt-5 sm:mt-6 relative overflow-hidden disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #007AFF 0%, #0051D5 100%)",
                    fontFamily: "SF Pro Text, system-ui, sans-serif",
                    animationDelay: isSignUp ? "0.25s" : "0.25s",
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                    </span>
                  ) : (
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  )}
                </Button>
              </form>

              <div className="relative py-5 sm:py-6 ios-fade-in" style={{ animationDelay: "0.25s" }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-400/40" />
                </div>
                <div className="relative flex justify-center">
                  <span
                    className="px-3 sm:px-4 text-[14px] sm:text-[15px] text-gray-600 font-normal"
                    style={{
                      background: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(8px)",
                      fontFamily: "SF Pro Text, system-ui, sans-serif",
                    }}
                  >
                    or
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 ios-fade-in" style={{ animationDelay: "0.3s" }}>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full h-[46px] sm:h-[50px] rounded-[12px] sm:rounded-[14px] flex items-center justify-center gap-2 sm:gap-3 text-[16px] sm:text-[17px] font-semibold text-gray-800 shadow-sm ios-transition active:scale-98 hover:scale-[1.02]"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    fontFamily: "SF Pro Text, system-ui, sans-serif",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="text-center mt-5 sm:mt-6 ios-fade-in" style={{ animationDelay: "0.35s" }}>
                <p
                  className="text-[14px] sm:text-[15px] text-gray-700"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-blue-600 hover:text-blue-700 font-semibold ios-transition active:opacity-70"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

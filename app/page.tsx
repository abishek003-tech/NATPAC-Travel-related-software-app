"use client"

import type React from "react"

import Link from "next/link"
import { ChevronRight, User, ShieldCheck, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [pressedCard, setPressedCard] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { x, y, id: Date.now() }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          backgroundImage: "url(/images/kerala-bg-new.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: hoveredCard ? "scale(1.05)" : "scale(1)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
        <div
          className={`text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="relative inline-block">
            <h1
              className="text-5xl sm:text-7xl md:text-8xl font-bold text-white drop-shadow-2xl tracking-tight relative z-10"
              style={{ letterSpacing: "-0.04em" }}
            >
              KERALA
            </h1>
            <div className="absolute inset-0 blur-3xl bg-blue-500/20 animate-pulse" />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 font-light tracking-wide drop-shadow-lg">
            Experience God's Own Country
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
            <span>Welcome to your journey</span>
          </div>
        </div>

        <div
          className={`flex flex-col gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-md transition-all duration-700 delay-150 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* User Login Button */}
          <Link
            href="/login"
            className="group"
            onMouseEnter={() => setHoveredCard("user")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`relative overflow-hidden ios-transition ${
                hoveredCard === "user" ? "scale-[1.02]" : "scale-100"
              } ${pressedCard === "user" ? "scale-[0.98]" : ""}`}
              style={{
                borderRadius: "28px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  hoveredCard === "user"
                    ? "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 30px rgba(59, 130, 246, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.5)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
                border:
                  hoveredCard === "user" ? "1.5px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onMouseDown={(e) => {
                setPressedCard("user")
                createRipple(e)
              }}
              onMouseUp={() => setPressedCard(null)}
              onMouseLeave={() => setPressedCard(null)}
            >
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-blue-400/20 pointer-events-none animate-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                  }}
                />
              ))}

              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/5 to-blue-500/0 transition-opacity duration-500`}
                style={{
                  borderRadius: "28px",
                  opacity: hoveredCard === "user" ? 1 : 0,
                }}
              />

              <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative z-10">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-lg ios-transition relative`}
                    style={{
                      background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                      transform: hoveredCard === "user" ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
                      boxShadow:
                        hoveredCard === "user"
                          ? "0 15px 30px -10px rgba(59, 130, 246, 0.6)"
                          : "0 8px 16px -4px rgba(59, 130, 246, 0.4)",
                    }}
                  >
                    <div
                      className={`absolute inset-0 rounded-full blur-lg transition-opacity duration-300`}
                      style={{
                        background: "rgba(59, 130, 246, 0.4)",
                        opacity: hoveredCard === "user" ? 1 : 0,
                      }}
                    />
                    <User
                      className={`h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10 ios-transition ${
                        hoveredCard === "user" ? "scale-110" : "scale-100"
                      }`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-base sm:text-lg font-bold tracking-tight transition-all duration-300`}
                      style={{
                        color: "#1F2937",
                        transform: hoveredCard === "user" ? "translateX(3px)" : "translateX(0)",
                      }}
                    >
                      User Login
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-medium transition-all duration-300`}
                      style={{
                        color: hoveredCard === "user" ? "#3B82F6" : "#9CA3AF",
                        transform: hoveredCard === "user" ? "translateX(3px)" : "translateX(0)",
                      }}
                    >
                      Sign in to your account
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <ChevronRight
                    className={`h-4 w-4 sm:h-5 sm:w-5 ios-transition`}
                    style={{
                      color: hoveredCard === "user" ? "#3B82F6" : "#9CA3AF",
                      transform: hoveredCard === "user" ? "translateX(6px) scale(1.2)" : "translateX(0) scale(1)",
                      strokeWidth: 2,
                    }}
                  />
                  {hoveredCard === "user" && (
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 absolute inset-0 animate-ping opacity-60" />
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Portal Button */}
          <Link
            href="/admin"
            className="group"
            onMouseEnter={() => setHoveredCard("admin")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`relative overflow-hidden ios-transition ${
                hoveredCard === "admin" ? "scale-[1.02]" : "scale-100"
              } ${pressedCard === "admin" ? "scale-[0.98]" : ""}`}
              style={{
                borderRadius: "28px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  hoveredCard === "admin"
                    ? "0 25px 50px -12px rgba(99, 102, 241, 0.25), 0 0 30px rgba(99, 102, 241, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.5)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
                border:
                  hoveredCard === "admin"
                    ? "1.5px solid rgba(99, 102, 241, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onMouseDown={(e) => {
                setPressedCard("admin")
                createRipple(e)
              }}
              onMouseUp={() => setPressedCard(null)}
              onMouseLeave={() => setPressedCard(null)}
            >
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-indigo-400/20 pointer-events-none animate-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                  }}
                />
              ))}

              <div
                className={`absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-400/5 to-indigo-500/0 transition-opacity duration-500`}
                style={{
                  borderRadius: "28px",
                  opacity: hoveredCard === "admin" ? 1 : 0,
                }}
              />

              <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 relative z-10">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-lg ios-transition relative`}
                    style={{
                      background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                      transform: hoveredCard === "admin" ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
                      boxShadow:
                        hoveredCard === "admin"
                          ? "0 15px 30px -10px rgba(124, 58, 237, 0.6)"
                          : "0 8px 16px -4px rgba(124, 58, 237, 0.4)",
                    }}
                  >
                    <div
                      className={`absolute inset-0 rounded-full blur-lg transition-opacity duration-300`}
                      style={{
                        background: "rgba(124, 58, 237, 0.4)",
                        opacity: hoveredCard === "admin" ? 1 : 0,
                      }}
                    />
                    <ShieldCheck
                      className={`h-6 w-6 sm:h-7 sm:w-7 text-white relative z-10 ios-transition ${
                        hoveredCard === "admin" ? "scale-110" : "scale-100"
                      }`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-base sm:text-lg font-bold tracking-tight transition-all duration-300`}
                      style={{
                        color: "#1F2937",
                        transform: hoveredCard === "admin" ? "translateX(3px)" : "translateX(0)",
                      }}
                    >
                      Admin Portal
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-medium transition-all duration-300`}
                      style={{
                        color: hoveredCard === "admin" ? "#7C3AED" : "#9CA3AF",
                        transform: hoveredCard === "admin" ? "translateX(3px)" : "translateX(0)",
                      }}
                    >
                      Dashboard access
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <ChevronRight
                    className={`h-4 w-4 sm:h-5 sm:w-5 ios-transition`}
                    style={{
                      color: hoveredCard === "admin" ? "#7C3AED" : "#9CA3AF",
                      transform: hoveredCard === "admin" ? "translateX(6px) scale(1.2)" : "translateX(0) scale(1)",
                      strokeWidth: 2,
                    }}
                  />
                  {hoveredCard === "admin" && (
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-300 absolute inset-0 animate-ping opacity-60" />
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div
          className={`mt-8 sm:mt-12 text-center transition-all duration-700 delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-xs sm:text-sm text-white/80 font-light">Secure authentication portal</p>
        </div>
      </div>
    </div>
  )
}

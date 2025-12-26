"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Shield, Users, BarChart3, Settings, Activity, Bell, Search } from "lucide-react"

export default function AdminHomePage() {
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const authType = sessionStorage.getItem("authType")
    const storedUsername = sessionStorage.getItem("username")

    if (authType !== "admin") {
      router.push("/admin")
    } else {
      setUsername(storedUsername || "Administrator")
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push("/")
  }

  const handleCardClick = (title: string) => {
    switch (title) {
      case "User Management":
        router.push("/admin-home/users")
        break
      case "Analytics":
        router.push("/admin-home/analytics")
        break
      case "System Health":
        router.push("/admin-home/system-health")
        break
      default:
        break
    }
  }

  const adminCards = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage user accounts",
      count: "1,234",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "View system analytics",
      count: "89%",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      title: "System Health",
      description: "Monitor performance",
      count: "Active",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "System settings",
      count: "12",
      color: "from-orange-500 to-red-500",
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/images/kerala-bg-new.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-blue-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div
          className="sticky top-0 z-20 border-b border-white/20"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 ios-fade-in">
                <div
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                  }}
                >
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1
                    className="text-base sm:text-lg font-semibold text-white"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    Admin Portal
                  </h1>
                  <p
                    className="text-xs sm:text-sm text-white/70"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 ios-transition active:scale-90"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 sm:h-10 rounded-full text-white font-medium ios-button-press"
                  style={{
                    background: "rgba(239, 68, 68, 0.8)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    fontFamily: "SF Pro Text, system-ui, sans-serif",
                  }}
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                  <span className="text-xs sm:text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8 ios-slide-up">
            <div
              className="rounded-[20px] sm:rounded-[28px] p-5 sm:p-8 border border-white/30 shadow-xl"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
                WebkitBackdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white mb-1.5 sm:mb-2"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    Welcome back, {username}
                  </h2>
                  <p
                    className="text-white/80 text-base sm:text-lg"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    Here's what's happening with your system today
                  </p>
                </div>
                <div
                  className="h-12 w-12 sm:h-16 sm:w-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                  }}
                >
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 ios-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <Search
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/60"
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Search admin panel..."
                className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-4 text-white placeholder:text-white/50 rounded-[16px] sm:rounded-[20px] border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ios-transition"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(15px)",
                  WebkitBackdropFilter: "blur(15px)",
                  fontFamily: "SF Pro Text, system-ui, sans-serif",
                }}
              />
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {adminCards.map((card, index) => (
              <div
                key={card.title}
                className="ios-scale-in group cursor-pointer"
                style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                onClick={() => handleCardClick(card.title)}
              >
                <div
                  className="rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border border-white/30 shadow-xl ios-transition hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.22)",
                    backdropFilter: "saturate(180%) blur(25px)",
                    WebkitBackdropFilter: "saturate(180%) blur(25px)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                      className={`h-11 w-11 sm:h-12 sm:w-12 rounded-[14px] sm:rounded-[16px] flex items-center justify-center bg-gradient-to-br ${card.color} shadow-lg`}
                    >
                      <card.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div
                      className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-white"
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(8px)",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      {card.count}
                    </div>
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-semibold text-white mb-1"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-white/70 text-xs sm:text-sm"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

interface SystemIssue {
  area: string
  status: "critical" | "warning" | "good"
  problems: string[]
  recommendations: string[]
}

export default function SystemHealthPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const systemIssues: SystemIssue[] = [
    {
      area: "Roads",
      status: "warning",
      problems: [
        "Potholes on NH-66 near Kochi causing traffic delays",
        "Poor road conditions on rural routes in Wayanad district",
        "Inadequate street lighting on state highways",
      ],
      recommendations: [
        "Implement quarterly road maintenance schedule",
        "Allocate budget for pothole repair and resurfacing",
        "Install LED street lighting on major highways",
        "Set up citizen reporting system for road issues",
      ],
    },
    {
      area: "Traffic Signals",
      status: "critical",
      problems: [
        "Non-functional signals at 12 major intersections",
        "Outdated timer systems causing congestion",
        "Lack of pedestrian crossing signals in urban areas",
      ],
      recommendations: [
        "Upgrade to smart traffic management systems",
        "Deploy AI-based adaptive signal timing",
        "Install pedestrian countdown timers at all crossings",
        "Regular maintenance and inspection protocols",
      ],
    },
    {
      area: "Police Management",
      status: "good",
      problems: ["Limited patrol presence in remote areas", "Response time delays during peak hours"],
      recommendations: [
        "Increase mobile patrol units in rural zones",
        "Implement GPS-based dispatch optimization",
        "Deploy motorcycle units for faster response",
        "Set up community policing programs",
      ],
    },
    {
      area: "Bus Services / Public Transport",
      status: "warning",
      problems: [
        "Irregular bus schedules causing passenger inconvenience",
        "Overcrowding during peak commute hours",
        "Lack of real-time tracking for buses",
        "Poor maintenance of bus stops and shelters",
      ],
      recommendations: [
        "Implement GPS tracking and real-time apps",
        "Increase bus frequency on high-demand routes",
        "Modernize bus fleet with air-conditioned vehicles",
        "Renovate bus stops with seating and shelters",
        "Introduce digital payment systems",
      ],
    },
  ]

  useEffect(() => {
    setMounted(true)
    const authType = sessionStorage.getItem("authType")
    if (authType !== "admin") {
      router.push("/admin")
    }
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "from-red-500 to-orange-500"
      case "warning":
        return "from-yellow-500 to-orange-500"
      case "good":
        return "from-green-500 to-emerald-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <XCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2.5} />
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
      default:
        return null
    }
  }

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
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin-home")}
                className="flex items-center gap-1 text-white/95 hover:text-white ios-transition active:scale-95"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                <span className="text-base sm:text-lg font-normal">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-white" strokeWidth={2} />
                <h1
                  className="text-lg sm:text-xl font-semibold text-white"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  System Health
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-6">
            {systemIssues.map((issue, index) => (
              <div
                key={index}
                className="rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border border-white/30 shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-white"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    {issue.area}
                  </h2>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor(issue.status)}`}
                  >
                    {getStatusIcon(issue.status)}
                    <span
                      className="text-xs font-semibold text-white uppercase"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      {issue.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3
                      className="text-base sm:text-lg font-semibold text-white mb-2"
                      style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                    >
                      Current Issues
                    </h3>
                    <ul className="space-y-2">
                      {issue.problems.map((problem, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-white/80 text-sm"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3
                      className="text-base sm:text-lg font-semibold text-white mb-2"
                      style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                    >
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {issue.recommendations.map((recommendation, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-white/80 text-sm"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Users, Download, MapPin, Calendar, Clock, Car, Target } from "lucide-react"

interface Trip {
  id: string
  date: string
  time: string
  origin: string
  destination: string
  distance: string
  mode: string
  purpose: string
}

interface User {
  id: string
  name: string
  email: string
  trips: Trip[]
}

export default function UserManagementPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const router = useRouter()

  const mockUsers: User[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      trips: [
        {
          id: "t1",
          date: "2024-01-15",
          time: "09:30 AM",
          origin: "Kochi",
          destination: "Munnar",
          distance: "130 km",
          mode: "Car",
          purpose: "Tourism",
        },
        {
          id: "t2",
          date: "2024-01-10",
          time: "02:00 PM",
          origin: "Trivandrum",
          destination: "Kovalam",
          distance: "16 km",
          mode: "Bike",
          purpose: "Business",
        },
      ],
    },
    {
      id: "2",
      name: "Priya Menon",
      email: "priya@example.com",
      trips: [
        {
          id: "t3",
          date: "2024-01-18",
          time: "11:00 AM",
          origin: "Alappuzha",
          destination: "Fort Kochi",
          distance: "53 km",
          mode: "Car",
          purpose: "Personal",
        },
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

  const handleDownload = (user: User) => {
    const data = {
      user: {
        name: user.name,
        email: user.email,
      },
      trips: user.trips,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${user.name.replace(/\s+/g, "_")}_trips.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
                <Users className="h-5 w-5 text-white" strokeWidth={2} />
                <h1
                  className="text-lg sm:text-xl font-semibold text-white"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  User Management
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {!selectedUser ? (
            <div className="space-y-4">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="rounded-[20px] p-5 border border-white/30 shadow-xl cursor-pointer ios-transition hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "rgba(255, 255, 255, 0.22)",
                    backdropFilter: "saturate(180%) blur(25px)",
                    WebkitBackdropFilter: "saturate(180%) blur(25px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-lg font-semibold text-white"
                        style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                      >
                        {user.name}
                      </h3>
                      <p className="text-sm text-white/70" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                        {user.email}
                      </p>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{
                        background: "rgba(59, 130, 246, 0.3)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {user.trips.length} {user.trips.length === 1 ? "trip" : "trips"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Header */}
              <div
                className="rounded-[20px] p-5 border border-white/30 shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2
                      className="text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                    >
                      {selectedUser.name}
                    </h2>
                    <p className="text-white/80" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                      {selectedUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedUser)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-medium ios-transition active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                    }}
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-sm text-white/70 hover:text-white ios-transition"
                >
                  ← Back to users
                </button>
              </div>

              {/* Trip Details */}
              <div className="space-y-4">
                <h3
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  Trip History
                </h3>
                {selectedUser.trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="rounded-[20px] p-5 border border-white/30 shadow-xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.22)",
                      backdropFilter: "saturate(180%) blur(25px)",
                      WebkitBackdropFilter: "saturate(180%) blur(25px)",
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(59, 130, 246, 0.3)" }}
                        >
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-xs text-white/60 mb-0.5"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            Date
                          </p>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(139, 92, 246, 0.3)" }}
                        >
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-xs text-white/60 mb-0.5"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            Time
                          </p>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(34, 197, 94, 0.3)" }}
                        >
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-xs text-white/60 mb-0.5"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            Origin
                          </p>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.origin}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(239, 68, 68, 0.3)" }}
                        >
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-xs text-white/60 mb-0.5"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            Destination
                          </p>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.destination}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(251, 146, 60, 0.3)" }}
                        >
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-xs text-white/60 mb-0.5"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            Mode & Distance
                          </p>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.mode} • {trip.distance}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(236, 72, 153, 0.3)" }}
                        >
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="text-xs text-white/60 mb-0.5"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            Purpose
                          </p>
                          <p
                            className="text-sm font-medium text-white"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.purpose}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

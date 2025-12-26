"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, BarChart3, MapPin, ExternalLink } from "lucide-react"

interface Destination {
  name: string
  coordinates: string
  location: string
  description: string
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const destinations: Destination[] = [
    {
      name: "Alappuzha",
      coordinates: "9.5011, 76.3388",
      location: "Alappuzha",
      description:
        "Alappuzha, also known as the 'Venice of the East', is renowned for its picturesque backwaters, tranquil houseboat cruises, and lush paddy fields. It's the heart of Kerala's backwater tourism.",
    },
    {
      name: "Fort Kochi",
      coordinates: "9.9667, 76.2422",
      location: "Fort Kochi",
      description:
        "Fort Kochi is a historic coastal town known for its colonial architecture, charming streets, Chinese fishing nets, and vibrant arts scene. It's a cultural hub blending Portuguese, Dutch, and British influences.",
    },
    {
      name: "Kovalam",
      coordinates: "8.4133, 76.9784",
      location: "Kovalam",
      description:
        "Kovalam is a famous beach destination with golden sands, palm-fringed shores, and vibrant nightlife. It's ideal for water sports, relaxation, and enjoying Kerala's coastal beauty.",
    },
    {
      name: "Munnar",
      coordinates: "10.0889, 77.0595",
      location: "Munnar",
      description:
        "Munnar, nestled in the Western Ghats, is famous for its rolling tea plantations, misty hills, and serene natural beauty. It's a haven for nature lovers, trekkers, and photographers seeking breathtaking landscapes.",
    },
    {
      name: "Wayanad",
      coordinates: "11.6857, 76.1314",
      location: "Wayanad",
      description:
        "Wayanad is a lush, green district in the Western Ghats, offering scenic views, wildlife sanctuaries, waterfalls, and spice plantations. It's perfect for adventure seekers and nature enthusiasts.",
    },
  ]

  useEffect(() => {
    setMounted(true)
    const authType = sessionStorage.getItem("authType")
    if (authType !== "admin") {
      router.push("/admin")
    }
  }, [router])

  const handleViewOnMap = (coordinates: string) => {
    const [lat, lng] = coordinates.split(", ")
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")
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
                <BarChart3 className="h-5 w-5 text-white" strokeWidth={2} />
                <h1
                  className="text-lg sm:text-xl font-semibold text-white"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  Analytics
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Popular Destinations Section */}
          <div
            className="rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 border border-white/30 shadow-xl mb-6"
            style={{
              background: "rgba(255, 255, 255, 0.22)",
              backdropFilter: "saturate(180%) blur(25px)",
              WebkitBackdropFilter: "saturate(180%) blur(25px)",
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
            >
              Popular Destinations
            </h2>
            <p
              className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8"
              style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
            >
              Discover the most beautiful and iconic places in Kerala, each offering unique experiences and
              unforgettable memories.
            </p>

            <div className="space-y-4 sm:space-y-5">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className="rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-white/20"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-white/80" strokeWidth={2} />
                        <h3
                          className="text-xl sm:text-2xl font-semibold text-white"
                          style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                        >
                          {destination.name}
                        </h3>
                      </div>
                      <p className="text-sm text-white/60 mb-1" style={{ fontFamily: "SF Mono, monospace" }}>
                        {destination.coordinates}
                      </p>
                      <p
                        className="text-sm font-medium text-white/80 mb-2"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {destination.location}
                      </p>
                      <p
                        className="text-white/70 text-sm leading-relaxed"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {destination.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewOnMap(destination.coordinates)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-medium ios-transition active:scale-95 self-start sm:self-auto whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                      }}
                    >
                      <span className="text-sm">View on Map</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

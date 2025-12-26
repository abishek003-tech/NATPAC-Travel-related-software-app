"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  LogOut,
  Home,
  Settings,
  MapPin,
  Search,
  Clock,
  Navigation,
  TrendingUp,
  AlertCircle,
  Route,
  Car,
  Satellite,
  ArrowRight,
  Check,
  Shield,
  Activity,
  Bell,
} from "lucide-react"

type TripStatus = "no-trip" | "in-progress" | "completed"
type TransportMode = "Car" | "Bus" | "Train" | "Walk" | "Bike" | "Auto"
type MapViewType = "satellite" | "standard"

interface TripRoute {
  id: string
  number: string
  coordinates: { lat: number; lng: number }[]
  origin: { lat: number; lng: number; name: string }
  destination: { lat: number; lng: number; name: string }
  startTime: string
  endTime: string
  distance: string
  mode: TransportMode
  isActive: boolean
}

interface StoredTrip {
  id: string
  tripNumber: string
  date: string
  time: string
  origin: string
  destination: string
  distance: string
  mode: TransportMode
  purpose: string
  startTime: string
  endTime: string
}

// Changed from HomePage to Dashboard
export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [userType, setUserType] = useState<"user" | "admin" | null>(null)
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [tripStatus, setTripStatus] = useState<TripStatus>("no-trip")
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.8505, lng: 76.2711 }) // Kerala coordinates
  const [tripStartTime, setTripStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const [showStopConfirmation, setShowStopConfirmation] = useState(false)
  const [manualTripData, setManualTripData] = useState({
    date: "",
    mode: "",
    distance: "",
    purpose: "",
    notes: "",
  })

  const [mapViewType, setMapViewType] = useState<MapViewType>("satellite")
  const [mapZoom, setMapZoom] = useState(15)
  const [mapCenter, setMapCenter] = useState(currentLocation)
  const [selectedTrip, setSelectedTrip] = useState<TripRoute | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const [tripHistory, setTripHistory] = useState<StoredTrip[]>([])
  const [showConfirmationSuccess, setShowConfirmationSuccess] = useState(false)
  const [latestTripNeedsConfirmation, setLatestTripNeedsConfirmation] = useState(true)

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const searchMarkerRef = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const sampleTrips: TripRoute[] = [
    {
      id: "1",
      number: "#TR-2025-001",
      coordinates: [
        { lat: 10.8505, lng: 76.2711 },
        { lat: 10.852, lng: 76.273 },
        { lat: 10.8545, lng: 76.2755 },
        { lat: 10.857, lng: 76.278 },
      ],
      origin: { lat: 10.8505, lng: 76.2711, name: "Kochi, Kerala" },
      destination: { lat: 10.857, lng: 76.278, name: "Thrissur, Kerala" },
      startTime: "08:30 AM",
      endTime: "10:15 AM",
      distance: "55.2 km",
      mode: "Bus",
      isActive: false,
    },
    {
      id: "2",
      number: "#TR-2025-002",
      coordinates: [
        { lat: 10.857, lng: 76.278 },
        { lat: 10.859, lng: 76.28 },
        { lat: 10.861, lng: 76.282 },
      ],
      origin: { lat: 10.857, lng: 76.278, name: "Thrissur, Kerala" },
      destination: { lat: 10.861, lng: 76.282, name: "Palakkad, Kerala" },
      startTime: "02:30 PM",
      endTime: "03:45 PM",
      distance: "42.6 km",
      mode: "Car",
      isActive: false,
    },
  ]

  const latestTrip = {
    number: "#TR-2025-001",
    origin: "Kochi, Kerala",
    destination: "Thrissur, Kerala",
    startTime: "08:30 AM",
    endTime: "10:15 AM",
    distance: "55.2 km",
    mode: "Car" as TransportMode,
    needsConfirmation: true, // This is used for the UI logic, not for the actual confirmation state
  }

  const dailySummary = {
    totalTrips: 3,
    totalDistance: "127.8 km",
    totalTime: "4h 35m",
  }

  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [motionPermission, setMotionPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [notificationPermission, setNotificationPermission] = useState<"granted" | "denied" | "prompt">("prompt")

  useEffect(() => {
    setMounted(true)
    const authType = sessionStorage.getItem("authType")
    const authUser = sessionStorage.getItem("username")

    if (!authType || !authUser) {
      router.push("/")
      return
    }

    setUserType(authType as "user" | "admin")
    setUsername(authUser)

    const savedTrips = localStorage.getItem("tripHistory")
    if (savedTrips) {
      try {
        setTripHistory(JSON.parse(savedTrips))
      } catch (error) {
        console.error("Error loading trip history:", error)
      }
    }
  }, [router])

  const checkPermissions = async () => {
    // Check location permission
    if ("permissions" in navigator) {
      try {
        const locationStatus = await navigator.permissions.query({ name: "geolocation" as PermissionName })
        setLocationPermission(locationStatus.state as "granted" | "denied" | "prompt")
      } catch (e) {
        console.log("[v0] Location permission check not supported")
      }
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission as "granted" | "denied" | "default")
    }

    // Motion permission check (iOS specific)
    if (typeof (DeviceMotionEvent as any)?.requestPermission === "function") {
      // iOS 13+ requires permission
      setMotionPermission("prompt")
    } else {
      // Android or older iOS - assume granted
      setMotionPermission("granted")
    }
  }

  useEffect(() => {
    checkPermissions()
  }, [])

  useEffect(() => {
    if (tripStatus === "in-progress" && tripStartTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - tripStartTime.getTime()) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [tripStatus, tripStartTime])

  useEffect(() => {
    if (activeTab === "map" && mapContainerRef.current && !mapInstanceRef.current) {
      const initMap = () => {
        if (typeof window !== "undefined" && (window as any).L) {
          const L = (window as any).L

          // Initialize map with smooth animations
          const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            zoomAnimation: true,
            fadeAnimation: true,
            markerZoomAnimation: true,
            preferCanvas: true,
          }).setView([11.3, 76.94], 15)

          // High-resolution satellite tiles (Google-style satellite imagery)
          L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
            maxZoom: 20,
            attribution: "© Google",
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
          }).addTo(map)

          mapInstanceRef.current = map

          // Get live location with accuracy circle
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude, accuracy } = pos.coords
                map.flyTo([latitude, longitude], 16, { duration: 1.5 })

                // Add accuracy circle
                L.circle([latitude, longitude], {
                  radius: accuracy,
                  color: "#3b82f6",
                  fillColor: "#3b82f6",
                  fillOpacity: 0.1,
                  weight: 1,
                }).addTo(map)

                // Add user marker with pulsing animation
                const userIcon = L.divIcon({
                  html: `<div style="width: 18px; height: 18px; background: #3b82f6; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 0 0 rgba(59, 130, 246, 1); animation: pulse 2s infinite;"></div>`,
                  className: "",
                  iconSize: [18, 18],
                  iconAnchor: [9, 9],
                })

                userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
                  .addTo(map)
                  .bindPopup("You are here")
              },
              (error) => {
                console.error("Geolocation error:", error)
              },
              { enableHighAccuracy: true },
            )
          }

          // Long press / right click pin drop with enhanced marker
          map.on("contextmenu", async (e: any) => {
            if (searchMarkerRef.current) {
              map.removeLayer(searchMarkerRef.current)
            }

            const { lat, lng } = e.latlng

            // Enhanced pin marker
            const icon = L.divIcon({
              html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style="filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4)); animation: bounceIn 0.5s ease-out;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ef4444"/></svg>`,
              className: "",
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            })

            searchMarkerRef.current = L.marker([lat, lng], { icon }).addTo(map)

            // Fetch location details
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
              const data = await res.json()
              const popupContent = `
                <div style="font-family: 'SF Pro Text', system-ui; padding: 4px;">
                  <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${data.display_name || "Dropped Pin"}</div>
                  <div style="font-size: 12px; color: #666;">${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
                </div>
              `
              searchMarkerRef.current.bindPopup(popupContent).openPopup()
            } catch {
              searchMarkerRef.current
                .bindPopup(
                  `<div style="font-family: 'SF Pro Text', system-ui; font-size: 13px;">${lat.toFixed(6)}, ${lng.toFixed(6)}</div>`,
                )
                .openPopup()
            }
          })
        }
      }

      if ((window as any).L) {
        initMap()
      } else {
        const checkLeaflet = setInterval(() => {
          if ((window as any).L) {
            clearInterval(checkLeaflet)
            initMap()
          }
        }, 100)
      }
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current && activeTab !== "map") {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        userMarkerRef.current = null
        searchMarkerRef.current = null
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === "map") {
      setMapCenter(currentLocation)
    }
  }, [currentLocation, activeTab])

  const handleLogout = () => {
    sessionStorage.removeItem("authType")
    sessionStorage.removeItem("username")
    router.push("/")
  }

  const handleStartTrip = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setTripStatus("in-progress")
          setTripStartTime(new Date())
        },
        (error) => {
          console.log("[v0] Geolocation error:", error)
          setTripStatus("in-progress")
          setTripStartTime(new Date())
        },
      )
    } else {
      setTripStatus("in-progress")
      setTripStartTime(new Date())
    }
  }

  const handleStopTrip = () => {
    setShowStopConfirmation(true)
  }

  const handleConfirmStopTrip = () => {
    setTripStatus("completed")
    setShowStopConfirmation(false)
    setLatestTripNeedsConfirmation(true)
  }

  const handleCancelStopTrip = () => {
    setShowStopConfirmation(false)
  }

  const handleAddManualTrip = () => {
    if (!manualTripData.date || !manualTripData.mode || !manualTripData.distance || !manualTripData.purpose) {
      alert("Please fill in all required fields (Date, Mode, Distance, Purpose)")
      return
    }

    const newTrip: StoredTrip = {
      id: Date.now().toString(),
      tripNumber: `#TR-2025-${String(tripHistory.length + 1).padStart(3, "0")}`,
      date: manualTripData.date,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      origin: "Manual Entry",
      destination: manualTripData.notes || "Manual Entry",
      distance: manualTripData.distance,
      mode: manualTripData.mode as TransportMode,
      purpose: manualTripData.purpose,
      startTime: "--:--",
      endTime: "--:--",
    }

    const updatedTripHistory = [...tripHistory, newTrip]
    setTripHistory(updatedTripHistory)
    localStorage.setItem("tripHistory", JSON.stringify(updatedTripHistory))

    // Clear form
    setManualTripData({
      date: "",
      mode: "",
      distance: "",
      purpose: "",
      notes: "",
    })

    setShowConfirmationSuccess(true)
    setTimeout(() => setShowConfirmationSuccess(false), 3000)
  }

  const handleClearManualTrip = () => {
    setManualTripData({
      date: "",
      mode: "",
      distance: "",
      purpose: "",
      notes: "",
    })
  }

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleZoomIn = () => {
    if (mapZoom < 20) setMapZoom(mapZoom + 1)
  }

  const handleZoomOut = () => {
    if (mapZoom > 5) setMapZoom(mapZoom - 1)
  }

  const handleRecenter = () => {
    setMapCenter(currentLocation)
    setPanOffset({ x: 0, y: 0 })
  }

  const toggleMapView = () => {
    setMapViewType(mapViewType === "satellite" ? "standard" : "satellite")
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true)
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsPanning(true)
    setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches[0]) {
      const touch = e.touches[0]
      setPanOffset({
        x: touch.clientX - panStart.x,
        y: touch.clientY - panStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    setIsPanning(false)
  }

  const searchCity = async () => {
    if (!searchInputRef.current || !mapInstanceRef.current) return

    const q = searchInputRef.current.value.trim()
    if (!q) return

    const L = (window as any).L
    if (searchMarkerRef.current) {
      mapInstanceRef.current.removeLayer(searchMarkerRef.current)
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`)
      const data = await res.json()

      if (!data.length) {
        alert("Location not found. Please try another search term.")
        return
      }

      const { lat, lon, display_name, type } = data[0]

      // Smooth fly animation to location
      mapInstanceRef.current.flyTo([lat, lon], 15, {
        duration: 2,
        easeLinearity: 0.25,
      })

      // Add focus ring animation
      const focusRing = L.circle([lat, lon], {
        radius: 800,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        weight: 3,
        dashArray: "10, 5",
      }).addTo(mapInstanceRef.current)

      // Create enhanced marker with location icon
      const markerIcon = L.divIcon({
        html: `
          <div style="position: relative; animation: bounceIn 0.6s ease-out;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style="filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3" fill="#3b82f6"/>
            </svg>
          </div>
        `,
        className: "",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      })

      searchMarkerRef.current = L.marker([lat, lon], { icon: markerIcon }).addTo(mapInstanceRef.current)

      // Enhanced popup with place details
      const popupContent = `
        <div style="font-family: 'SF Pro Text', system-ui; padding: 8px; min-width: 200px;">
          <div style="font-weight: 600; font-size: 15px; margin-bottom: 6px; color: #1a1a1a;">${display_name}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Type: ${type || "Location"}</div>
          <div style="font-size: 11px; color: #999;">${Number.parseFloat(lat).toFixed(6)}, ${Number.parseFloat(lon).toFixed(6)}</div>
        </div>
      `

      searchMarkerRef.current.bindPopup(popupContent, { closeButton: true, className: "custom-popup" }).openPopup()

      // Remove focus ring after 3 seconds
      setTimeout(() => {
        if (focusRing) {
          mapInstanceRef.current.removeLayer(focusRing)
        }
      }, 3000)

      // Clear search input
      searchInputRef.current.value = ""
    } catch (error) {
      console.error("Search error:", error)
      alert("Search failed. Please check your internet connection and try again.")
    }
  }

  const handleConfirmTrip = () => {
    const newTrip: StoredTrip = {
      id: Date.now().toString(),
      tripNumber: latestTrip.number,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      origin: latestTrip.origin,
      destination: latestTrip.destination,
      distance: latestTrip.distance,
      mode: latestTrip.mode,
      purpose: "Work", // Default purpose, can be made dynamic
      startTime: latestTrip.startTime,
      endTime: latestTrip.endTime,
    }

    const updatedTripHistory = [...tripHistory, newTrip]
    setTripHistory(updatedTripHistory)
    localStorage.setItem("tripHistory", JSON.stringify(updatedTripHistory))

    setLatestTripNeedsConfirmation(false)
    setShowConfirmationSuccess(true)
    setTimeout(() => setShowConfirmationSuccess(false), 3000)
  }

  if (!mounted || !userType) {
    return null
  }

  const renderMapTab = () => {
    return (
      <div className="relative h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
        <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[90%] max-w-[420px] z-[1000] px-3 sm:px-0">
          <div
            className="flex items-center gap-2 sm:gap-3 rounded-[20px] sm:rounded-[28px] px-4 sm:px-5 py-2.5 sm:py-3 border border-white/30 shadow-2xl ios-transition hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search cities, towns, places..."
              className="flex-1 bg-transparent border-none outline-none text-white text-sm sm:text-base placeholder-white/70 font-medium min-w-0"
              style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
              onKeyPress={(e) => {
                if (e.key === "Enter") searchCity()
              }}
            />
            <button
              onClick={searchCity}
              className="w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center ios-transition active:scale-90 hover:scale-110 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8))",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              }}
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-full rounded-[18px] sm:rounded-[24px] overflow-hidden shadow-2xl border border-white/20"
          style={{
            background: "#000",
          }}
        />

        <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-4 z-[1000]">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                const L = (window as any).L
                mapInstanceRef.current.eachLayer((layer: any) => {
                  if (layer instanceof L.TileLayer) {
                    mapInstanceRef.current.removeLayer(layer)
                  }
                })

                const newType = mapViewType === "satellite" ? "standard" : "satellite"
                setMapViewType(newType)

                if (newType === "satellite") {
                  L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
                    maxZoom: 20,
                    subdomains: ["mt0", "mt1", "mt2", "mt3"],
                  }).addTo(mapInstanceRef.current)
                } else {
                  L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
                    maxZoom: 20,
                    subdomains: ["mt0", "mt1", "mt2", "mt3"],
                  }).addTo(mapInstanceRef.current)
                }
              }
            }}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 ios-transition active:scale-90 border border-white/30 shadow-xl"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(30px)",
            }}
          >
            <Satellite className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="text-white text-xs sm:text-sm font-semibold">
              {mapViewType === "satellite" ? "Satellite" : "Hybrid"}
            </span>
          </button>
        </div>
      </div>
    )
  }

  // Permission check functions
  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission("granted")
          alert("Location access granted!")
        },
        (error) => {
          setLocationPermission("denied")
          alert("Location access denied. Please enable it in your browser settings.")
        },
        { enableHighAccuracy: true },
      )
    }
  }

  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any)?.requestPermission === "function") {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission()
        setMotionPermission(response === "granted" ? "granted" : "denied")
        alert(response === "granted" ? "Motion access granted!" : "Motion access denied")
      } catch (error) {
        setMotionPermission("denied")
        alert("Motion access denied")
      }
    } else {
      alert("Motion tracking is already available on this device")
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission as "granted" | "denied" | "default")
      alert(permission === "granted" ? "Notification access granted!" : "Notification access denied")
    }
  }

  const getPermissionLabel = (state: string) => {
    if (state === "granted") return "Granted"
    if (state === "denied") return "Not Allowed"
    return "Allow"
  }

  const getPermissionColor = (state: string) => {
    if (state === "granted") return "text-green-600"
    if (state === "denied") return "text-red-600"
    return "text-blue-600"
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
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30" />
      </div>

      <div className="relative z-10 min-h-screen p-3 sm:p-4 pb-28 sm:pb-32">
        {/* Header */}
        <div className="ios-fade-in mb-3 sm:mb-4">
          <div
            className="rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 shadow-lg border border-white/30"
            style={{
              background: "rgba(255, 255, 255, 0.22)",
              backdropFilter: "saturate(180%) blur(25px)",
              WebkitBackdropFilter: "saturate(180%) blur(25px)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className="text-[17px] sm:text-[20px] font-bold text-gray-900"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  NATPAC Travel Tracker
                </h1>
                <p
                  className="text-[12px] sm:text-[13px] text-gray-700"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  {username} • Kerala Transportation
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center ios-transition active:scale-90"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <LogOut className="h-4 w-4 text-gray-700" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {activeTab === "home" && (
          <>
            <div className="ios-slide-up mb-4">
              <div
                className="rounded-[24px] p-5 sm:p-6 shadow-xl border border-white/30"
                style={{
                  background: tripStatus === "in-progress" ? "rgba(16, 185, 129, 0.18)" : "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <div className="mb-4">
                  <h2
                    className="text-[22px] sm:text-[24px] font-bold text-gray-900"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    {tripStatus === "no-trip" || tripStatus === "completed" ? "No Trip Detected" : "Trip in Progress"}
                  </h2>
                  <p
                    className="text-[13px] sm:text-[14px] text-gray-700 mt-1"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {tripStatus === "no-trip" || tripStatus === "completed"
                      ? "Ready to start tracking"
                      : `Recording since ${formatElapsedTime(elapsedTime)}`}
                  </p>
                </div>

                {tripStatus === "in-progress" && (
                  <div
                    className="rounded-[16px] p-3 mb-4"
                    style={{
                      background: "rgba(255, 255, 255, 0.4)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-green-600" strokeWidth={2.5} />
                      <span
                        className="text-[13px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Current Location
                      </span>
                    </div>
                    <p
                      className="text-[12px] text-gray-700 font-mono"
                      style={{ fontFamily: "SF Mono, Courier, monospace" }}
                    >
                      {currentLocation.lat.toFixed(6)}°N, {currentLocation.lng.toFixed(6)}°E
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleStartTrip}
                    disabled={tripStatus === "in-progress"}
                    className="flex-1 rounded-[16px] py-3.5 sm:py-4 font-semibold text-[15px] sm:text-[17px] ios-transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{
                      background:
                        tripStatus === "in-progress"
                          ? "rgba(156, 163, 175, 0.5)"
                          : "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      color: "white",
                      fontFamily: "SF Pro Text, system-ui, sans-serif",
                    }}
                  >
                    {tripStatus === "in-progress" ? "Tracking..." : "Start"}
                  </button>
                  <button
                    onClick={handleStopTrip}
                    disabled={tripStatus !== "in-progress"}
                    className="flex-1 rounded-[16px] py-3.5 sm:py-4 font-semibold text-[15px] sm:text-[17px] ios-transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{
                      background:
                        tripStatus === "in-progress"
                          ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                          : "rgba(156, 163, 175, 0.5)",
                      color: "white",
                      fontFamily: "SF Pro Text, system-ui, sans-serif",
                    }}
                  >
                    Stop
                  </button>
                </div>
              </div>
            </div>

            {showStopConfirmation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div
                  className="w-full max-w-sm rounded-[24px] p-6 shadow-2xl border border-white/30 ios-slide-up"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "saturate(180%) blur(25px)",
                  }}
                >
                  <h3
                    className="text-[20px] font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    Stop Trip?
                  </h3>
                  <p
                    className="text-[14px] text-gray-700 mb-6"
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    Do you want to stop and confirm this trip?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelStopTrip}
                      className="flex-1 rounded-[14px] py-3 font-semibold text-[15px] ios-transition active:scale-95"
                      style={{
                        background: "rgba(156, 163, 175, 0.2)",
                        color: "#374151",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmStopTrip}
                      className="flex-1 rounded-[14px] py-3 font-semibold text-[15px] ios-transition active:scale-95 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                        color: "white",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      Stop Trip
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="ios-slide-up mb-4" style={{ animationDelay: "0.1s" }}>
              <div
                className="rounded-[24px] p-5 sm:p-6 shadow-xl border border-white/30"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <h3
                  className="text-[20px] sm:text-[22px] font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  Add New Trip
                </h3>
                <p
                  className="text-[13px] sm:text-[14px] text-gray-700 mb-5"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  Manually enter your travel details
                </p>

                <div className="space-y-4">
                  {/* Date Field */}
                  <div>
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      value={manualTripData.date}
                      onChange={(e) => setManualTripData({ ...manualTripData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-[14px] border-none outline-none text-[15px] text-gray-900 placeholder-gray-500"
                      style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    />
                  </div>

                  {/* Select Mode */}
                  <div>
                    <select
                      value={manualTripData.mode}
                      onChange={(e) => setManualTripData({ ...manualTripData, mode: e.target.value })}
                      className="w-full px-4 py-3 rounded-[14px] border-none outline-none text-[15px] text-gray-900"
                      style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      <option value="">Select mode</option>
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Walk">Walk</option>
                      <option value="Bike">Bike</option>
                      <option value="Auto">Auto</option>
                    </select>
                  </div>

                  {/* Distance Input */}
                  <div>
                    <input
                      type="text"
                      placeholder="Distance in km"
                      value={manualTripData.distance}
                      onChange={(e) => setManualTripData({ ...manualTripData, distance: e.target.value })}
                      className="w-full px-4 py-3 rounded-[14px] border-none outline-none text-[15px] text-gray-900 placeholder-gray-500"
                      style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    />
                  </div>

                  {/* Select Purpose */}
                  <div>
                    <select
                      value={manualTripData.purpose}
                      onChange={(e) => setManualTripData({ ...manualTripData, purpose: e.target.value })}
                      className="w-full px-4 py-3 rounded-[14px] border-none outline-none text-[15px] text-gray-900"
                      style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      <option value="">Select purpose</option>
                      <option value="Work">Work</option>
                      <option value="Education">Education</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Notes Text Area */}
                  <div>
                    <textarea
                      placeholder="Any additional information about this trip..."
                      value={manualTripData.notes}
                      onChange={(e) => setManualTripData({ ...manualTripData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-[14px] border-none outline-none text-[15px] text-gray-900 placeholder-gray-500 resize-none"
                      style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(10px)",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAddManualTrip}
                      className="flex-1 rounded-[16px] py-3.5 sm:py-4 font-semibold text-[15px] sm:text-[17px] ios-transition active:scale-95 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #007AFF 0%, #0051D5 100%)",
                        color: "white",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      Add Trip
                    </button>
                    <button
                      onClick={handleClearManualTrip}
                      className="flex-1 rounded-[16px] py-3.5 sm:py-4 font-semibold text-[15px] sm:text-[17px] ios-transition active:scale-95"
                      style={{
                        background: "rgba(156, 163, 175, 0.3)",
                        color: "#374151",
                        fontFamily: "SF Pro Text, system-ui, sans-serif",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Trip Card */}
            {latestTrip.needsConfirmation && latestTripNeedsConfirmation && (
              <div className="ios-slide-up mb-4" style={{ animationDelay: "0.1s" }}>
                <div
                  className="rounded-[24px] p-5 shadow-lg border border-white/30"
                  style={{
                    background: "rgba(255, 255, 255, 0.22)",
                    backdropFilter: "saturate(180%) blur(25px)",
                    WebkitBackdropFilter: "saturate(180%) blur(25px)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" strokeWidth={2.5} />
                    <span
                      className="text-[15px] font-semibold text-orange-600"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      Trip Confirmation Required
                    </span>
                  </div>

                  <h3
                    className="text-[18px] font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    Latest Trip {latestTrip.number}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-3">
                      <Navigation className="h-4 w-4 text-green-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <p
                          className="text-[13px] text-gray-600"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          Origin
                        </p>
                        <p
                          className="text-[15px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {latestTrip.origin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-red-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <p
                          className="text-[13px] text-gray-600"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          Destination
                        </p>
                        <p
                          className="text-[15px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {latestTrip.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-[12px]"
                    style={{
                      background: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    <div>
                      <p
                        className="text-[11px] text-gray-600 mb-1"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Start Time
                      </p>
                      <p
                        className="text-[13px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {latestTrip.startTime}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[11px] text-gray-600 mb-1"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        End Time
                      </p>
                      <p
                        className="text-[13px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {latestTrip.endTime}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[11px] text-gray-600 mb-1"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Distance
                      </p>
                      <p
                        className="text-[13px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        {latestTrip.distance}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-[11px] text-gray-600 mb-1"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Mode
                      </p>
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3 text-gray-700" strokeWidth={2} />
                        <p
                          className="text-[13px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {latestTrip.mode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmTrip} // Changed from placeholder to actual handler
                    className="w-full rounded-[14px] py-3 font-semibold text-[15px] ios-transition active:scale-95 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                      color: "white",
                      fontFamily: "SF Pro Text, system-ui, sans-serif",
                    }}
                  >
                    Confirm Trip Details
                  </button>
                </div>
              </div>
            )}

            {showConfirmationSuccess && (
              <div className="ios-slide-up mb-4" style={{ animationDelay: "0.05s" }}>
                <div
                  className="rounded-[20px] p-4 shadow-lg border border-green-200/50"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    backdropFilter: "saturate(180%) blur(25px)",
                    WebkitBackdropFilter: "saturate(180%) blur(25px)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      }}
                    >
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    </div>
                    <div>
                      <p
                        className="text-[15px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Trip Confirmed Successfully!
                      </p>
                      <p
                        className="text-[13px] text-gray-700"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Added to your trip history
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Summary */}
            <div className="ios-slide-up mb-4" style={{ animationDelay: "0.2s" }}>
              <div
                className="rounded-[24px] p-5 shadow-lg border border-white/30"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
                  <h3
                    className="text-[18px] font-bold text-gray-900"
                    style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                  >
                    Today's Summary
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="rounded-[14px] p-3 text-center"
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                    }}
                  >
                    <p
                      className="text-[24px] font-bold text-blue-600"
                      style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                    >
                      {dailySummary.totalTrips}
                    </p>
                    <p
                      className="text-[11px] text-gray-700"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      Trips
                    </p>
                  </div>
                  <div
                    className="rounded-[14px] p-3 text-center"
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                    }}
                  >
                    <p
                      className="text-[24px] font-bold text-green-600"
                      style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                    >
                      {dailySummary.totalDistance}
                    </p>
                    <p
                      className="text-[11px] text-gray-700"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      Distance
                    </p>
                  </div>
                  <div
                    className="rounded-[14px] p-3 text-center"
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                    }}
                  >
                    <p
                      className="text-[24px] font-bold text-orange-600"
                      style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                    >
                      {dailySummary.totalTime}
                    </p>
                    <p
                      className="text-[11px] text-gray-700"
                      style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                    >
                      Duration
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 ios-slide-up" style={{ animationDelay: "0.3s" }}>
              <button
                className="rounded-[20px] p-4 shadow-lg border border-white/30 ios-transition active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <Route className="h-6 w-6 text-purple-600 mb-2" strokeWidth={2} />
                <p
                  className="text-[15px] font-semibold text-gray-900"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  Trip History
                </p>
                <p className="text-[11px] text-gray-600" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                  View all trips
                </p>
              </button>

              <button
                className="rounded-[20px] p-4 shadow-lg border border-white/30 ios-transition active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <Settings className="h-6 w-6 text-gray-700 mb-2" strokeWidth={2} />
                <p
                  className="text-[15px] font-semibold text-gray-900"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  Settings
                </p>
                <p className="text-[11px] text-gray-600" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                  App preferences
                </p>
              </button>
            </div>

            {/* Privacy Notice */}
            <div
              className="mt-6 p-4 rounded-[16px] ios-fade-in"
              style={{
                animationDelay: "0.4s",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p
                className="text-[11px] text-gray-700 text-center leading-relaxed"
                style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
              >
                Your trip data is used exclusively for transportation planning research by NATPAC. All location
                information is anonymized and stored securely.
              </p>
            </div>
          </>
        )}

        {activeTab === "map" && renderMapTab()}

        {activeTab === "history" && (
          <div className="ios-fade-in space-y-3">
            <div
              className="rounded-[24px] p-5 shadow-lg border border-white/30"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
                WebkitBackdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
                <h2
                  className="text-[20px] font-bold text-gray-900"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  Trip History
                </h2>
              </div>
              <p className="text-[13px] text-gray-700" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                {tripHistory.length} trip{tripHistory.length !== 1 ? "s" : ""} recorded
              </p>
            </div>

            {tripHistory.length === 0 ? (
              <div
                className="rounded-[24px] p-8 shadow-lg border border-white/30 text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "saturate(180%) blur(25px)",
                  WebkitBackdropFilter: "saturate(180%) blur(25px)",
                }}
              >
                <Route className="h-12 w-12 text-gray-500 mx-auto mb-3" strokeWidth={2} />
                <h3
                  className="text-[17px] font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  No Trips Yet
                </h3>
                <p className="text-[13px] text-gray-700" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                  Your confirmed trips will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tripHistory.map((trip, index) => (
                  <div
                    key={trip.id}
                    className="ios-slide-up rounded-[20px] p-4 shadow-lg border border-white/30"
                    style={{
                      background: "rgba(255, 255, 255, 0.22)",
                      backdropFilter: "saturate(180%) blur(25px)",
                      WebkitBackdropFilter: "saturate(180%) blur(25px)",
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p
                          className="text-[15px] font-bold text-gray-900"
                          style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                        >
                          {trip.tripNumber}
                        </p>
                        <p
                          className="text-[12px] text-gray-600"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {trip.date} • {trip.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/40">
                        <Car className="h-3 w-3 text-gray-700" strokeWidth={2} />
                        <span
                          className="text-[11px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {trip.mode}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2">
                        <Navigation className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[11px] text-gray-600"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            From
                          </p>
                          <p
                            className="text-[13px] font-semibold text-gray-900 truncate"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.origin}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[11px] text-gray-600"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            To
                          </p>
                          <p
                            className="text-[13px] font-semibold text-gray-900 truncate"
                            style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                          >
                            {trip.destination}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/30">
                      <div className="flex-1">
                        <p
                          className="text-[10px] text-gray-600"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          Distance
                        </p>
                        <p
                          className="text-[13px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {trip.distance}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-[10px] text-gray-600"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          Duration
                        </p>
                        <p
                          className="text-[13px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {trip.startTime} - {trip.endTime}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-[10px] text-gray-600"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          Purpose
                        </p>
                        <p
                          className="text-[13px] font-semibold text-gray-900"
                          style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                        >
                          {trip.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "search" && (
          <div className="ios-fade-in">
            <div
              className="rounded-[24px] p-8 shadow-lg border border-white/30 text-center"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" strokeWidth={2} />
              <h2
                className="text-[20px] font-bold text-gray-900 mb-2"
                style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
              >
                Search Trips
              </h2>
              <p className="text-[13px] text-gray-700" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                Search functionality coming soon
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="ios-fade-in space-y-4">
            <div
              className="rounded-[24px] p-6 sm:p-8 shadow-lg border border-white/30"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-blue-600" strokeWidth={2} />
                <h2
                  className="text-[18px] sm:text-[20px] font-bold text-gray-900"
                  style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
                >
                  App Permissions
                </h2>
              </div>

              <div className="space-y-3">
                {/* Location Permission */}
                <div
                  className="flex items-center justify-between p-4 rounded-[16px] border border-white/20"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(59, 130, 246, 0.15)",
                      }}
                    >
                      <MapPin className="h-5 w-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[14px] sm:text-[15px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Location Access
                      </p>
                      <p
                        className="text-[11px] sm:text-[12px] text-gray-600"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Required for trip tracking
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={requestLocationPermission}
                    disabled={locationPermission === "granted"}
                    className={`px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold ios-transition active:scale-95 ${
                      locationPermission === "granted"
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {getPermissionLabel(locationPermission)}
                  </button>
                </div>

                {/* Motion Permission */}
                <div
                  className="flex items-center justify-between p-4 rounded-[16px] border border-white/20"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(139, 92, 246, 0.15)",
                      }}
                    >
                      <Activity className="h-5 w-5 text-purple-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[14px] sm:text-[15px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Motion / Activity Tracking
                      </p>
                      <p
                        className="text-[11px] sm:text-[12px] text-gray-600"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Detects movement and activity
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={requestMotionPermission}
                    disabled={motionPermission === "granted"}
                    className={`px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold ios-transition active:scale-95 ${
                      motionPermission === "granted"
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {getPermissionLabel(motionPermission)}
                  </button>
                </div>

                {/* Notification Permission */}
                <div
                  className="flex items-center justify-between p-4 rounded-[16px] border border-white/20"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(234, 179, 8, 0.15)",
                      }}
                    >
                      <Bell className="h-5 w-5 text-yellow-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[14px] sm:text-[15px] font-semibold text-gray-900"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Notifications
                      </p>
                      <p
                        className="text-[11px] sm:text-[12px] text-gray-600"
                        style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                      >
                        Get trip reminders and alerts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={requestNotificationPermission}
                    disabled={notificationPermission === "granted"}
                    className={`px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold ios-transition active:scale-95 ${
                      notificationPermission === "granted"
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {getPermissionLabel(notificationPermission)}
                  </button>
                </div>
              </div>

              <div
                className="mt-4 p-3 rounded-[12px] border border-blue-200"
                style={{
                  background: "rgba(59, 130, 246, 0.08)",
                }}
              >
                <p
                  className="text-[11px] sm:text-[12px] text-blue-800"
                  style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                >
                  💡 All permissions are required for the app to work properly. If denied, please enable them in your
                  browser settings.
                </p>
              </div>
            </div>

            <div
              className="rounded-[24px] p-8 shadow-lg border border-white/30 text-center"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "saturate(180%) blur(25px)",
              }}
            >
              <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" strokeWidth={2} />
              <h2
                className="text-[20px] font-bold text-gray-900 mb-2"
                style={{ fontFamily: "SF Pro Display, system-ui, sans-serif" }}
              >
                Settings
              </h2>
              <p className="text-[13px] text-gray-700" style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}>
                App settings coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-safe">
        <div
          className="border-t border-white/20"
          style={{
            background: "rgba(255, 255, 255, 0.22)",
            backdropFilter: "saturate(180%) blur(25px)",
            WebkitBackdropFilter: "saturate(180%) blur(25px)",
          }}
        >
          <div className="max-w-[500px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-around gap-2">
              {[
                { id: "home", icon: Home, label: "Home" },
                { id: "map", icon: MapPin, label: "Map" },
                { id: "history", icon: Clock, label: "History" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-[14px] ios-transition active:scale-95 ${
                    activeTab === tab.id ? "bg-white/20" : ""
                  }`}
                >
                  <tab.icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${activeTab === tab.id ? "text-blue-600" : "text-gray-700"}`}
                    strokeWidth={activeTab === tab.id ? 2.5 : 2}
                  />
                  <span
                    className={`text-[11px] sm:text-[12px] font-medium ${
                      activeTab === tab.id ? "text-gray-900" : "text-gray-700"
                    }`}
                    style={{ fontFamily: "SF Pro Text, system-ui, sans-serif" }}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bell, CheckCircle, X, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { RoleSidebar } from "@/components/role-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { MapView } from "@/components/map-view"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock emergency notifications
const mockNotifications = [
  {
    id: "1",
    type: "emergency",
    status: "new",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    sender: {
      name: "Rahul Sharma",
      location: { lat: 28.6139, lng: 77.209 },
      phone: "+91 98765 43210",
    },
    description: "Car accident with multiple injuries",
    photoUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    type: "emergency",
    status: "new",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    sender: {
      name: "Priya Patel",
      location: { lat: 28.6129, lng: 77.2295 },
      phone: "+91 87654 32109",
    },
    description: "Medical emergency - chest pain",
    photoUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    type: "emergency",
    status: "new",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    sender: {
      name: "Amit Kumar",
      location: { lat: 28.6271, lng: 77.2218 },
      phone: "+91 76543 21098",
    },
    description: "Elderly person fallen and unable to get up",
    photoUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function DriverDashboardPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [driverStatus, setDriverStatus] = useState<"available" | "busy" | "offline">("available")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<any>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    // Get driver's location when the dashboard loads
    if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLocating(false)
          toast({
            title: "Location detected",
            description: "Your current location has been successfully detected.",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Unable to get your location. Please enable location services.",
          })
        },
      )
    }

    // Simulate receiving a new notification after 10 seconds
    const timer = setTimeout(() => {
      const newNotification = {
        id: "4",
        type: "emergency",
        status: "new",
        timestamp: new Date().toISOString(),
        sender: {
          name: "Neha Singh",
          location: { lat: 28.6129, lng: 77.208 },
          phone: "+91 65432 10987",
        },
        description: "Urgent: Multiple vehicle collision on Ring Road",
        photoUrl: "/placeholder.svg?height=200&width=300",
      }

      setNotifications((prev) => [newNotification, ...prev])

      toast({
        title: "New Emergency Alert!",
        description: "You have received a new emergency alert.",
        variant: "destructive",
      })
    }, 10000)

    return () => clearTimeout(timer)
  }, [toast])

  const handleNotificationClick = (notification: any) => {
    setCurrentNotification(notification)
    setShowNotificationDialog(true)
  }

  const handleAcceptJob = () => {
    setShowNotificationDialog(false)
    setDriverStatus("busy")

    // Update notification status
    setNotifications((prev) => prev.map((n) => (n.id === currentNotification.id ? { ...n, status: "accepted" } : n)))

    toast({
      title: "Job Accepted",
      description: "You have accepted the emergency request. Please proceed to the location.",
    })
  }

  const handleRejectJob = () => {
    setShowNotificationDialog(false)

    // Update notification status
    setNotifications((prev) => prev.map((n) => (n.id === currentNotification.id ? { ...n, status: "rejected" } : n)))

    toast({
      title: "Job Rejected",
      description: "You have rejected the emergency request.",
    })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTimeSince = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    return `${diffHours} hours ago`
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <RoleSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
              </div>
              <h1 className="text-xl font-bold text-red-600">Respondr</h1>
              <Badge className="ml-2 bg-red-600">Driver Dashboard</Badge>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`px-3 py-1 ${
                    driverStatus === "available"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : driverStatus === "busy"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {driverStatus === "available" ? "Available" : driverStatus === "busy" ? "Busy" : "Offline"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDriverStatus(driverStatus === "available" ? "offline" : "available")}
                  className={driverStatus === "busy" ? "opacity-50 cursor-not-allowed" : ""}
                  disabled={driverStatus === "busy"}
                >
                  {driverStatus === "available" ? "Go Offline" : "Go Online"}
                </Button>
              </div>
              {location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4 text-red-600" />
                  <span className="hidden md:inline">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push("/driver/notifications")}
              >
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => n.status === "new").length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.filter((n) => n.status === "new").length}
                  </span>
                )}
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-red-100 text-red-600">{user?.name?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
              <Card className="lg:col-span-3 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 h-[500px]">
                <CardContent className="p-0 h-full">
                  <MapView location={location} isLocating={isLocating} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>Emergency Alerts</span>
                      <Badge className="bg-red-500">{notifications.filter((n) => n.status === "new").length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">No emergency alerts</div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                              notification.status === "new"
                                ? "bg-red-50 border-red-200"
                                : notification.status === "accepted"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200"
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium text-sm">{notification.sender.name}</h3>
                              <Badge
                                variant="outline"
                                className={
                                  notification.status === "new"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : notification.status === "accepted"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                }
                              >
                                {notification.status === "new"
                                  ? "New"
                                  : notification.status === "accepted"
                                    ? "Accepted"
                                    : "Rejected"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">{getTimeSince(notification.timestamp)}</p>
                            <p className="text-sm mt-1 line-clamp-2">{notification.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Verification Status</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {user?.role === "driver" ? "Complete your verification to accept jobs" : ""}
                        </p>
                      </div>
                      <Button
                        onClick={() => router.push("/driver/verification")}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 hover:scale-105"
                      >
                        Complete Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Emergency Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Alert</DialogTitle>
            <DialogDescription>A new emergency has been reported. Do you want to accept this job?</DialogDescription>
          </DialogHeader>

          {currentNotification && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={currentNotification.photoUrl || "/placeholder.svg"}
                  alt="Emergency"
                  className="w-full h-auto"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Reporter:</span>
                  <span className="text-sm">{currentNotification.sender.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Contact:</span>
                  <span className="text-sm">{currentNotification.sender.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Time:</span>
                  <span className="text-sm">{getTimeSince(currentNotification.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">
                    {currentNotification.sender.location.lat.toFixed(4)},
                    {currentNotification.sender.location.lng.toFixed(4)}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium">Description:</span>
                  <p className="text-sm mt-1">{currentNotification.description}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleRejectJob}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button type="button" onClick={handleAcceptJob} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

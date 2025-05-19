"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, User, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { MapView } from "@/components/map-view"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock emergency alerts
const mockEmergencies = [
  {
    id: "e1",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    location: { lat: 40.7128, lng: -74.006 },
    status: "new",
    patientName: "John Doe",
    contactNumber: "+1 (555) 123-4567",
    emergencyType: "Medical",
    description: "Chest pain and difficulty breathing",
  },
  {
    id: "e2",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    location: { lat: 40.7148, lng: -74.008 },
    status: "accepted",
    patientName: "Jane Smith",
    contactNumber: "+1 (555) 987-6543",
    emergencyType: "Accident",
    description: "Car accident with possible injuries",
  },
  {
    id: "e3",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    location: { lat: 40.7118, lng: -74.003 },
    status: "completed",
    patientName: "Robert Johnson",
    contactNumber: "+1 (555) 456-7890",
    emergencyType: "Medical",
    description: "Allergic reaction",
  },
]

export default function DriverDashboardPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [emergencies, setEmergencies] = useState(mockEmergencies)
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null)
  const [driverStatus, setDriverStatus] = useState<"available" | "busy" | "offline">("available")
  const router = useRouter()
  const { toast } = useToast()

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

    // Simulate receiving a new emergency alert after 10 seconds
    const timer = setTimeout(() => {
      const newEmergency = {
        id: "e4",
        timestamp: new Date().toISOString(),
        location: { lat: 40.7138, lng: -74.005 },
        status: "new",
        patientName: "Michael Brown",
        contactNumber: "+1 (555) 234-5678",
        emergencyType: "Medical",
        description: "Sudden collapse, possible stroke",
      }

      setEmergencies((prev) => [newEmergency, ...prev])

      toast({
        title: "New Emergency Alert!",
        description: "You have received a new emergency alert.",
        variant: "destructive",
      })
    }, 10000)

    return () => clearTimeout(timer)
  }, [toast])

  const handleAcceptEmergency = (id: string) => {
    setEmergencies((prev) =>
      prev.map((emergency) => (emergency.id === id ? { ...emergency, status: "accepted" } : emergency)),
    )
    setDriverStatus("busy")
    setSelectedEmergency(id)

    toast({
      title: "Emergency Accepted",
      description: "You have accepted the emergency alert. Please proceed to the location.",
    })
  }

  const handleCompleteEmergency = (id: string) => {
    setEmergencies((prev) =>
      prev.map((emergency) => (emergency.id === id ? { ...emergency, status: "completed" } : emergency)),
    )
    setDriverStatus("available")
    setSelectedEmergency(null)

    toast({
      title: "Emergency Completed",
      description: "Thank you for your service. You are now available for new emergencies.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">New</Badge>
      case "accepted":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
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
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                <img src="/Respondr.webp" alt="Logo" />
              </div>
              <h1 className="text-xl font-bold text-red-600">Respondr</h1>
              <Badge className="ml-2 bg-red-600">Ambulance Driver</Badge>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-1",
                    driverStatus === "available"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : driverStatus === "busy"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-gray-100 text-gray-800 border-gray-200",
                  )}
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
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Emergency Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="new">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="new" className="flex-1">
                          New
                        </TabsTrigger>
                        <TabsTrigger value="accepted" className="flex-1">
                          In Progress
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="flex-1">
                          Completed
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="new" className="space-y-4">
                        {emergencies.filter((e) => e.status === "new").length === 0 ? (
                          <div className="text-center py-6 text-gray-500">No new emergency alerts</div>
                        ) : (
                          emergencies
                            .filter((emergency) => emergency.status === "new")
                            .map((emergency) => (
                              <Card
                                key={emergency.id}
                                className={cn(
                                  "cursor-pointer hover:border-red-200 transition-all",
                                  selectedEmergency === emergency.id ? "border-red-500" : "",
                                )}
                                onClick={() => setSelectedEmergency(emergency.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="font-medium">{emergency.emergencyType}</h3>
                                      <p className="text-sm text-gray-500">{getTimeSince(emergency.timestamp)}</p>
                                    </div>
                                    {getStatusBadge(emergency.status)}
                                  </div>
                                  <p className="text-sm mb-3">{emergency.description}</p>
                                  <div className="flex justify-between">
                                    <Button
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptEmergency(emergency.id)
                                      }}
                                    >
                                      Accept
                                    </Button>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>~2.3 miles away</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                        )}
                      </TabsContent>

                      <TabsContent value="accepted" className="space-y-4">
                        {emergencies.filter((e) => e.status === "accepted").length === 0 ? (
                          <div className="text-center py-6 text-gray-500">No emergencies in progress</div>
                        ) : (
                          emergencies
                            .filter((emergency) => emergency.status === "accepted")
                            .map((emergency) => (
                              <Card
                                key={emergency.id}
                                className={cn(
                                  "cursor-pointer hover:border-yellow-200 transition-all",
                                  selectedEmergency === emergency.id ? "border-yellow-500" : "",
                                )}
                                onClick={() => setSelectedEmergency(emergency.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="font-medium">{emergency.emergencyType}</h3>
                                      <p className="text-sm text-gray-500">{getTimeSince(emergency.timestamp)}</p>
                                    </div>
                                    {getStatusBadge(emergency.status)}
                                  </div>
                                  <p className="text-sm mb-3">{emergency.description}</p>
                                  <div className="flex justify-between">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-600 text-green-600 hover:bg-green-50"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCompleteEmergency(emergency.id)
                                      }}
                                    >
                                      Complete
                                    </Button>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>In progress</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                        )}
                      </TabsContent>

                      <TabsContent value="completed" className="space-y-4">
                        {emergencies.filter((e) => e.status === "completed").length === 0 ? (
                          <div className="text-center py-6 text-gray-500">No completed emergencies</div>
                        ) : (
                          emergencies
                            .filter((emergency) => emergency.status === "completed")
                            .map((emergency) => (
                              <Card
                                key={emergency.id}
                                className="cursor-pointer hover:border-green-200 transition-all"
                                onClick={() => setSelectedEmergency(emergency.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="font-medium">{emergency.emergencyType}</h3>
                                      <p className="text-sm text-gray-500">{getTimeSince(emergency.timestamp)}</p>
                                    </div>
                                    {getStatusBadge(emergency.status)}
                                  </div>
                                  <p className="text-sm">{emergency.description}</p>
                                </CardContent>
                              </Card>
                            ))
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-0 h-[400px]">
                    <MapView
                      location={location}
                      isLocating={isLocating}
                      emergencies={emergencies}
                      selectedEmergency={selectedEmergency}
                    />
                  </CardContent>
                </Card>

                {selectedEmergency && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Emergency Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {emergencies
                        .filter((emergency) => emergency.id === selectedEmergency)
                        .map((emergency) => (
                          <div key={emergency.id} className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">{emergency.emergencyType}</h3>
                              {getStatusBadge(emergency.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className="text-sm text-gray-500">Patient</div>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-gray-500" />
                                  {emergency.patientName}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm text-gray-500">Contact</div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                  <a href={`tel:${emergency.contactNumber}`} className="text-red-600 hover:underline">
                                    {emergency.contactNumber}
                                  </a>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm text-gray-500">Time</div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  {formatTime(emergency.timestamp)} ({getTimeSince(emergency.timestamp)})
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="text-sm text-gray-500">Location</div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                  {emergency.location.lat.toFixed(6)}, {emergency.location.lng.toFixed(6)}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm text-gray-500">Description</div>
                              <p>{emergency.description}</p>
                            </div>

                            <div className="flex justify-between pt-4">
                              {emergency.status === "new" ? (
                                <Button
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleAcceptEmergency(emergency.id)}
                                >
                                  Accept Emergency
                                </Button>
                              ) : emergency.status === "accepted" ? (
                                <Button
                                  variant="outline"
                                  className="border-green-600 text-green-600 hover:bg-green-50"
                                  onClick={() => handleCompleteEmergency(emergency.id)}
                                >
                                  Complete Emergency
                                </Button>
                              ) : (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-5 w-5 mr-2" />
                                  Completed
                                </div>
                              )}

                              <Button
                                variant="outline"
                                onClick={() =>
                                  window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${emergency.location.lat},${emergency.location.lng}`,
                                    "_blank",
                                  )
                                }
                              >
                                Get Directions
                              </Button>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

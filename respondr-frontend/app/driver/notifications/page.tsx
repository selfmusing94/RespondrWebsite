"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleSidebar } from "@/components/role-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Bell, CheckCircle, X, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock notifications
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
    type: "system",
    status: "unread",
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    title: "Verification Update",
    description: "Your driver verification is pending. Please complete all required steps.",
  },
  {
    id: "4",
    type: "emergency",
    status: "accepted",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
    sender: {
      name: "Amit Kumar",
      location: { lat: 28.6271, lng: 77.2218 },
      phone: "+91 76543 21098",
    },
    description: "Elderly person fallen and unable to get up",
    photoUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    type: "system",
    status: "read",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
    title: "Welcome to Respondr",
    description:
      "Thank you for joining Respondr as a driver. Complete your verification to start accepting emergency requests.",
  },
]

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleAcceptJob = (id: string) => {
    // Update notification status
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "accepted" } : n)))

    toast({
      title: "Job Accepted",
      description: "You have accepted the emergency request. Please proceed to the location.",
    })
  }

  const handleRejectJob = (id: string) => {
    // Update notification status
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "rejected" } : n)))

    toast({
      title: "Job Rejected",
      description: "You have rejected the emergency request.",
    })
  }

  const handleMarkAsRead = (id: string) => {
    // Update notification status
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)))
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
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
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
              <Badge className="ml-2 bg-red-600">Notifications</Badge>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="all" className="flex-1">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="emergency" className="flex-1">
                        Emergency Alerts
                      </TabsTrigger>
                      <TabsTrigger value="system" className="flex-1">
                        System
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onAccept={handleAcceptJob}
                          onReject={handleRejectJob}
                          onMarkAsRead={handleMarkAsRead}
                        />
                      ))}
                    </TabsContent>

                    <TabsContent value="emergency" className="space-y-4">
                      {notifications
                        .filter((n) => n.type === "emergency")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onAccept={handleAcceptJob}
                            onReject={handleRejectJob}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                    </TabsContent>

                    <TabsContent value="system" className="space-y-4">
                      {notifications
                        .filter((n) => n.type === "system")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onAccept={handleAcceptJob}
                            onReject={handleRejectJob}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function NotificationItem({ notification, onAccept, onReject, onMarkAsRead }: any) {
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
    if (diffHours < 24) return `${diffHours} hours ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  if (notification.type === "emergency") {
    return (
      <div
        className={`p-4 rounded-lg border ${
          notification.status === "new"
            ? "bg-red-50 border-red-200"
            : notification.status === "accepted"
              ? "bg-green-50 border-green-200"
              : notification.status === "rejected"
                ? "bg-gray-50 border-gray-200"
                : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/4">
            <img
              src={notification.photoUrl || "/placeholder.svg"}
              alt="Emergency"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{notification.sender.name}</h3>
                <p className="text-sm text-gray-500">{getTimeSince(notification.timestamp)}</p>
              </div>
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
                {notification.status === "new" ? "New" : notification.status === "accepted" ? "Accepted" : "Rejected"}
              </Badge>
            </div>
            <p className="mb-3">{notification.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-sm">
                <span className="font-medium">Contact:</span> {notification.sender.phone}
              </div>
              <div className="text-sm">
                <span className="font-medium">Location:</span> {notification.sender.location.lat.toFixed(4)},{" "}
                {notification.sender.location.lng.toFixed(4)}
              </div>
            </div>
            {notification.status === "new" && (
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(notification.id)}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button size="sm" onClick={() => onAccept(notification.id)} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Accept
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    // System notification
    return (
      <div
        className={`p-4 rounded-lg border ${
          notification.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {notification.status === "unread" ? (
              <Info className="h-5 w-5 text-blue-600" />
            ) : (
              <Info className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-xs text-gray-500">{getTimeSince(notification.timestamp)}</p>
            </div>
            <p className="text-sm text-gray-600 mb-2">{notification.description}</p>
            {notification.status === "unread" && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  Mark as read
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

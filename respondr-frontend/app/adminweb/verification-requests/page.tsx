"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleSidebar } from "@/components/role-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Shield, CheckCircle, X, Eye } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock verification requests
const mockVerificationRequests = [
  {
    id: "1",
    driverName: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 98765 43210",
    licenseNumber: "DL-0420110012345",
    vehicleRegistration: "DL01AB1234",
    status: "pending",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    idProofUrl: "/placeholder.svg?height=300&width=400",
    licenseUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "2",
    driverName: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+91 87654 32109",
    licenseNumber: "DL-0520110054321",
    vehicleRegistration: "DL02CD5678",
    status: "pending",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
    idProofUrl: "/placeholder.svg?height=300&width=400",
    licenseUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    driverName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 76543 21098",
    licenseNumber: "DL-0620110067890",
    vehicleRegistration: "DL03EF9012",
    status: "pending",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
    idProofUrl: "/placeholder.svg?height=300&width=400",
    licenseUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "4",
    driverName: "Neha Patel",
    email: "neha.patel@example.com",
    phone: "+91 65432 10987",
    licenseNumber: "DL-0720110089012",
    vehicleRegistration: "DL04GH3456",
    status: "pending",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
    idProofUrl: "/placeholder.svg?height=300&width=400",
    licenseUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "5",
    driverName: "Vikram Malhotra",
    email: "vikram.malhotra@example.com",
    phone: "+91 54321 09876",
    licenseNumber: "DL-0820110012345",
    vehicleRegistration: "DL05IJ7890",
    status: "pending",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60000).toISOString(),
    idProofUrl: "/placeholder.svg?height=300&width=400",
    licenseUrl: "/placeholder.svg?height=300&width=400",
  },
]

export default function AdminVerificationRequestsPage() {
  const [verificationRequests, setVerificationRequests] = useState(mockVerificationRequests)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [currentImage, setCurrentImage] = useState<{ url: string; title: string } | null>(null)

  const { toast } = useToast()
  const { user } = useAuth()

  const handleApprove = (id: string) => {
    setVerificationRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req)))

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: "approved" })
    }

    toast({
      title: "Verification Approved",
      description: "The driver verification has been approved.",
    })
  }

  const handleReject = (id: string) => {
    setVerificationRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: "rejected" })
    }

    toast({
      title: "Verification Rejected",
      description: "The driver verification has been rejected.",
    })
  }

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setShowDetailsDialog(true)
  }

  const handleViewImage = (url: string, title: string) => {
    setCurrentImage({ url, title })
    setShowImageDialog(true)
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
              <Badge className="ml-2 bg-red-600">Verification Requests</Badge>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Driver Verification Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pending">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="pending" className="flex-1">
                        Pending
                        <Badge className="ml-2 bg-yellow-500">
                          {verificationRequests.filter((r) => r.status === "pending").length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="approved" className="flex-1">
                        Approved
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="flex-1">
                        Rejected
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                      {verificationRequests.filter((r) => r.status === "pending").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No pending verification requests</div>
                      ) : (
                        <div className="space-y-4">
                          {verificationRequests
                            .filter((r) => r.status === "pending")
                            .map((request) => (
                              <div key={request.id} className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <h3 className="font-medium">{request.driverName}</h3>
                                    <p className="text-sm text-gray-600">
                                      {request.email} • {request.phone}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        License: {request.licenseNumber}
                                      </Badge>
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        Vehicle: {request.vehicleRegistration}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Submitted {getTimeSince(request.submittedAt)}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                                      <Eye className="mr-1 h-4 w-4" />
                                      View Details
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleReject(request.id)}
                                      className="border-red-600 text-red-600 hover:bg-red-50"
                                    >
                                      <X className="mr-1 h-4 w-4" />
                                      Reject
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(request.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="mr-1 h-4 w-4" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4">
                      {verificationRequests.filter((r) => r.status === "approved").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No approved verification requests</div>
                      ) : (
                        <div className="space-y-4">
                          {verificationRequests
                            .filter((r) => r.status === "approved")
                            .map((request) => (
                              <div key={request.id} className="p-4 rounded-lg border border-green-200 bg-green-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <h3 className="font-medium">{request.driverName}</h3>
                                    <p className="text-sm text-gray-600">
                                      {request.email} • {request.phone}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        License: {request.licenseNumber}
                                      </Badge>
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        Vehicle: {request.vehicleRegistration}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Submitted {getTimeSince(request.submittedAt)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                                      <Eye className="mr-1 h-4 w-4" />
                                      View Details
                                    </Button>
                                    <Badge className="bg-green-600">Approved</Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-4">
                      {verificationRequests.filter((r) => r.status === "rejected").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No rejected verification requests</div>
                      ) : (
                        <div className="space-y-4">
                          {verificationRequests
                            .filter((r) => r.status === "rejected")
                            .map((request) => (
                              <div key={request.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <h3 className="font-medium">{request.driverName}</h3>
                                    <p className="text-sm text-gray-600">
                                      {request.email} • {request.phone}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        License: {request.licenseNumber}
                                      </Badge>
                                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        Vehicle: {request.vehicleRegistration}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Submitted {getTimeSince(request.submittedAt)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                                      <Eye className="mr-1 h-4 w-4" />
                                      View Details
                                    </Button>
                                    <Badge className="bg-gray-600">Rejected</Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>Review driver verification documents and information</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="border rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleViewImage(selectedRequest.idProofUrl, "ID Proof")}
                >
                  <div className="aspect-video relative">
                    <img
                      src={selectedRequest.idProofUrl || "/placeholder.svg"}
                      alt="ID Proof"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-2 text-center text-sm font-medium">ID Proof</div>
                </div>

                <div
                  className="border rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleViewImage(selectedRequest.licenseUrl, "Driver's License")}
                >
                  <div className="aspect-video relative">
                    <img
                      src={selectedRequest.licenseUrl || "/placeholder.svg"}
                      alt="Driver's License"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-2 text-center text-sm font-medium">Driver's License</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Driver Name</p>
                    <p>{selectedRequest.driverName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                    <p>{getTimeSince(selectedRequest.submittedAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Number</p>
                    <p>{selectedRequest.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle Registration</p>
                    <p>{selectedRequest.vehicleRegistration}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            {selectedRequest?.status === "pending" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedRequest.id)
                    setShowDetailsDialog(false)
                  }}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    handleApprove(selectedRequest.id)
                    setShowDetailsDialog(false)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedRequest?.status === "approved" && (
              <div className="flex items-center text-green-600 ml-auto">
                <CheckCircle className="mr-2 h-5 w-5" />
                Approved
              </div>
            )}
            {selectedRequest?.status === "rejected" && (
              <div className="flex items-center text-gray-600 ml-auto">
                <X className="mr-2 h-5 w-5" />
                Rejected
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentImage?.title}</DialogTitle>
          </DialogHeader>

          {currentImage && (
            <div className="flex justify-center">
              <img
                src={currentImage.url || "/placeholder.svg"}
                alt={currentImage.title}
                className="max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, MapPin, Send, X, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AnimatedSection } from "@/components/animated-section"

export default function ReportIncidentPage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Unable to get your location. Please enable location services.",
          })
        },
      )
    }
  }, [toast])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        variant: "destructive",
        title: "Camera error",
        description: "Unable to access your camera. Please check permissions.",
      })
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame on the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL("image/jpeg")
        setPhotoURL(dataURL)
        setPhotoTaken(true)

        // Stop the camera stream
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }

        // Simulate AI analysis
        simulateAIAnalysis()
      }
    }
  }

  const simulateAIAnalysis = () => {
    setAiAnalyzing(true)

    // Simulate AI processing time
    setTimeout(() => {
      setAiAnalyzing(false)
      setAiResult(
        "High severity road accident detected. Multiple vehicles involved. Dispatching emergency services with priority.",
      )

      toast({
        title: "AI Analysis Complete",
        description: "Incident severity assessed. Emergency services will be notified.",
      })
    }, 2500)
  }

  const retakePhoto = () => {
    setPhotoTaken(false)
    setPhotoURL(null)
    setAiResult(null)
    startCamera()
  }

  const handleSubmit = async () => {
    if (!photoURL) {
      toast({
        variant: "destructive",
        title: "Photo required",
        description: "Please take a photo of the incident.",
      })
      return
    }

    if (!location) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "We need your location to send help. Please enable location services.",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate sending the report
    try {
      // In a real app, this would be an API call to send the report
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Report sent successfully",
        description: "Emergency services have been notified and help is on the way.",
      })

      router.push("/report-success")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to send report",
        description: "Please try again or call emergency services directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="container mx-auto max-w-md">
        <Button
          variant="ghost"
          className="mb-4 transition-all duration-300 hover:scale-105"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <AnimatedSection>
          <Card className="shadow-lg overflow-hidden">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle className="text-xl">Report Emergency Incident</CardTitle>
              <CardDescription className="text-red-100">
                Take a photo and share your location to get help quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {!cameraActive && !photoTaken ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Camera className="h-12 w-12 text-red-600" />
                  <p className="text-center text-gray-600">Take a photo of the incident to help emergency services</p>
                  <Button
                    onClick={startCamera}
                    className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105"
                  >
                    Open Camera
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {cameraActive && !photoTaken && (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <Button
                          onClick={takePhoto}
                          className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-110 animate-pulse"
                        >
                          <Camera className="h-8 w-8" />
                        </Button>
                      </div>
                    </>
                  )}

                  {photoTaken && photoURL && (
                    <div className="relative">
                      <img src={photoURL || "/placeholder.svg"} alt="Incident" className="w-full h-auto rounded-lg" />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white hover:bg-gray-100 transition-all duration-300"
                        onClick={retakePhoto}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              {aiAnalyzing && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 animate-pulse">
                  <div className="flex items-center">
                    <div className="mr-3 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p className="text-blue-800 text-sm font-medium">AI analyzing incident severity...</p>
                  </div>
                </div>
              )}

              {aiResult && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-blue-800 text-sm font-medium mb-1">AI Analysis Result:</h4>
                  <p className="text-gray-700 text-sm">{aiResult}</p>
                </div>
              )}

              {location && (
                <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Your current location</p>
                    <p className="text-gray-600">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Incident Description (Optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened and any important details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] transition-all duration-200 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-[1.02]"
                disabled={!photoTaken || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Sending Report...</span>
                  </div>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Emergency Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}

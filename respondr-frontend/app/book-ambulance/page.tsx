"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, ArrowLeft, Ambulance } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AnimatedSection } from "@/components/animated-section"

export default function BookAmbulancePage() {
  const [patientName, setPatientName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emergencyType, setEmergencyType] = useState("accident")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nearbyAmbulances, setNearbyAmbulances] = useState<number>(0)
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

          // Simulate finding nearby ambulances
          setTimeout(() => {
            setNearbyAmbulances(Math.floor(Math.random() * 3) + 1)
          }, 1000)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "We need your location to send an ambulance. Please enable location services.",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate booking the ambulance
    try {
      // In a real app, this would be an API call to book the ambulance
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Ambulance booked successfully",
        description: "An ambulance has been dispatched to your location.",
      })

      router.push("/booking-success")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to book ambulance",
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
              <CardTitle className="text-xl">Book an Ambulance</CardTitle>
              <CardDescription className="text-red-100">Request emergency medical transportation</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {nearbyAmbulances > 0 && (
                <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center">
                  <Ambulance className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-800 text-sm">
                    <span className="font-bold">{nearbyAmbulances}</span> ambulance{nearbyAmbulances > 1 ? "s" : ""}{" "}
                    available nearby
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                    className="transition-all duration-200 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emergency Type</Label>
                  <RadioGroup
                    value={emergencyType}
                    onValueChange={setEmergencyType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accident" id="accident" />
                      <Label htmlFor="accident" className="cursor-pointer">
                        Road Accident
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medical" id="medical" />
                      <Label htmlFor="medical" className="cursor-pointer">
                        Medical Emergency
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other Emergency
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {location && (
                  <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Pickup location</p>
                      <p className="text-gray-600">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Describe the emergency situation, any injuries, or special requirements..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[100px] transition-all duration-200 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Booking Ambulance...</span>
                    </div>
                  ) : (
                    <>
                      <Ambulance className="mr-2 h-4 w-4" /> Book Ambulance Now
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}

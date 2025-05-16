"use client"

import { useEffect, useRef } from "react"

interface MapViewProps {
  location: { lat: number; lng: number } | null
  isLocating: boolean
}

export function MapView({ location, isLocating }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Create a simulated map view with animation
    const mapElement = mapRef.current

    // Clear previous content
    mapElement.innerHTML = ""

    // Create map container
    const mapContainer = document.createElement("div")
    mapContainer.className = "w-full h-full bg-gray-100 flex items-center justify-center relative"

    // Add grid lines to simulate a map
    const gridOverlay = document.createElement("div")
    gridOverlay.className = "absolute inset-0 grid grid-cols-8 grid-rows-6"

    // Create grid cells
    for (let i = 0; i < 48; i++) {
      const cell = document.createElement("div")
      cell.className = "border border-gray-200/30"
      gridOverlay.appendChild(cell)
    }

    mapContainer.appendChild(gridOverlay)

    // Add content based on state
    if (isLocating) {
      const loadingContainer = document.createElement("div")
      loadingContainer.className = "text-center p-4 z-10"

      const spinner = document.createElement("div")
      spinner.className = "animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"

      const text = document.createElement("p")
      text.textContent = "Detecting your location..."
      text.className = "text-gray-600"

      loadingContainer.appendChild(spinner)
      loadingContainer.appendChild(text)
      mapContainer.appendChild(loadingContainer)
    } else if (location) {
      // Add location marker
      const marker = document.createElement("div")
      marker.className = "absolute z-10 animate-bounce"
      marker.style.top = "50%"
      marker.style.left = "50%"
      marker.style.transform = "translate(-50%, -50%)"

      const pin = document.createElement("div")
      pin.className = "h-8 w-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
      pin.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>'

      const pulse = document.createElement("div")
      pulse.className = "absolute inset-0 rounded-full bg-red-600 opacity-30 animate-ping"

      pin.appendChild(pulse)
      marker.appendChild(pin)

      // Add location text
      const locationText = document.createElement("div")
      locationText.className =
        "absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10 text-sm"
      locationText.innerHTML = `<div class="font-medium text-gray-900">Your Location</div><div class="text-gray-600">${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</div>`

      mapContainer.appendChild(marker)
      mapContainer.appendChild(locationText)

      // Add some fake map elements
      const roads = document.createElement("div")
      roads.className = "absolute inset-0 z-0"

      // Horizontal road
      const hRoad = document.createElement("div")
      hRoad.className = "absolute top-1/2 left-0 right-0 h-3 bg-gray-300 transform -translate-y-1/2"

      // Vertical road
      const vRoad = document.createElement("div")
      vRoad.className = "absolute top-0 bottom-0 left-1/2 w-2 bg-gray-300 transform -translate-x-1/2"

      roads.appendChild(hRoad)
      roads.appendChild(vRoad)
      mapContainer.appendChild(roads)

      // Add controls
      const controls = document.createElement("div")
      controls.className = "absolute top-4 right-4 flex flex-col gap-2"

      const zoomIn = document.createElement("button")
      zoomIn.className = "h-8 w-8 bg-white rounded-md shadow flex items-center justify-center hover:bg-gray-100"
      zoomIn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>'

      const zoomOut = document.createElement("button")
      zoomOut.className = "h-8 w-8 bg-white rounded-md shadow flex items-center justify-center hover:bg-gray-100"
      zoomOut.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path></svg>'

      controls.appendChild(zoomIn)
      controls.appendChild(zoomOut)
      mapContainer.appendChild(controls)
    } else {
      const errorContainer = document.createElement("div")
      errorContainer.className = "text-center p-4"

      const icon = document.createElement("div")
      icon.className = "h-12 w-12 mx-auto mb-2 flex items-center justify-center rounded-full bg-red-100"
      icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-red-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>'

      const text = document.createElement("p")
      text.textContent = "Unable to get your location"
      text.className = "text-gray-600"

      errorContainer.appendChild(icon)
      errorContainer.appendChild(text)
      mapContainer.appendChild(errorContainer)
    }

    mapElement.appendChild(mapContainer)
  }, [location, isLocating])

  return <div ref={mapRef} className="aspect-video relative bg-gray-100 flex items-center justify-center"></div>
}

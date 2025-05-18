"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  location: { lat: number; lng: number } | null;
  isLocating: boolean;
}

export function MapView({ location, isLocating }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !location) return;

    if (mapInstance.current) {
      mapInstance.current.setView([location.lat, location.lng], 16);
      return;
    }

    mapInstance.current = L.map(mapRef.current).setView([location.lat, location.lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    const marker = L.marker([location.lat, location.lng], {
      icon: L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    }).addTo(mapInstance.current);

    marker.bindPopup("You are here").openPopup();
  }, [location]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 md:h-96 rounded-lg shadow-inner"
    >
      {isLocating && (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-600">
          Detecting your location...
        </div>
      )}
    </div>
  );
}

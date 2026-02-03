"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MarkerData {
  lat: number;
  lng: number;
  label: string;
  color: "red" | "blue" | "green";
}

interface MapViewProps {
  customerLocation?: { lat: number; lng: number } | null;
  agentLocation?: { lat: number; lng: number } | null;
  showDirections?: boolean;
  height?: string;
}

// Decode Google-style encoded polyline (used by OSRM)
function decodePolyline(encoded: string): [number, number][] {
  const result: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let shift = 0, result1 = 0, b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result1 |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += (result1 & 1) ? ~(result1 >> 1) : (result1 >> 1);

    shift = 0; result1 = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result1 |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result1 & 1) ? ~(result1 >> 1) : (result1 >> 1);

    result.push([lat / 1e5, lng / 1e5]);
  }
  return result;
}

export default function MapView({ customerLocation, agentLocation, showDirections = false, height = "400px" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef = useRef<L.Polyline | null>(null);

  const customerIconUrl = "https://raw.githubusercontent.com/pointdata/leaflet-icons/master/icons/icon-red.svg";
  const agentIconUrl = "https://raw.githubusercontent.com/pointdata/leaflet-icons/master/icons/icon-blue.svg";

  // Fallback custom icons using divIcon
  const customerIcon = L.divIcon({
    html: `<div style="background:#ef4444;border:3px solid #fff;border-radius:50%;width:24px;height:24px;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: "",
  });

  const agentIcon = L.divIcon({
    html: `<div style="background:#3b82f6;border:3px solid #fff;border-radius:50%;width:24px;height:24px;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: "",
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = customerLocation || agentLocation || { lat: 12.97, lng: 77.59 }; // Bangalore fallback

    const map = L.map(mapRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers and route when locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Clear old route
    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    const bounds: [number, number][] = [];

    // Customer marker
    if (customerLocation) {
      const marker = L.marker([customerLocation.lat, customerLocation.lng], { icon: customerIcon })
        .addTo(map)
        .bindPopup("<b style='color:#ef4444'>📍 Customer Location</b>", { maxWidth: 150 });
      markersRef.current.push(marker);
      bounds.push([customerLocation.lat, customerLocation.lng]);
    }

    // Agent marker
    if (agentLocation) {
      const marker = L.marker([agentLocation.lat, agentLocation.lng], { icon: agentIcon })
        .addTo(map)
        .bindPopup("<b style='color:#3b82f6'>🚗 Delivery Agent</b>", { maxWidth: 150 });
      markersRef.current.push(marker);
      bounds.push([agentLocation.lat, agentLocation.lng]);
    }

    // Fit map to bounds
    if (bounds.length === 2) {
      map.fitBounds(bounds as [[number, number], [number, number]], { padding: [40, 40] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 15);
    }

    // Fetch and draw route if both locations exist and directions requested
    if (showDirections && customerLocation && agentLocation) {
      fetchRoute(agentLocation, customerLocation);
    }
  }, [customerLocation, agentLocation, showDirections]);

  // Fetch driving route from OSRM (free, no API key)
  const fetchRoute = async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=polyline`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const polylineCoords = decodePolyline(data.routes[0].geometry);
        const map = mapInstanceRef.current;
        if (map) {
          routeRef.current = L.polyline(polylineCoords, {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 5",
          }).addTo(map);
          map.fitBounds(polylineCoords as [[number, number], [number, number]], { padding: [40, 40] });
        }
      }
    } catch {
      console.error("Route fetch failed, showing straight line");
      // Fallback: draw a straight line
      const map = mapInstanceRef.current;
      if (map && customerLocation && agentLocation) {
        routeRef.current = L.polyline(
          [[agentLocation.lat, agentLocation.lng], [customerLocation.lat, customerLocation.lng]],
          { color: "#3b82f6", weight: 3, opacity: 0.7, dashArray: "8, 8" }
        ).addTo(map);
      }
    }
  };

  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

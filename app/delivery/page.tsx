"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Package, MapPin, Phone, User, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  // --- Location-sharing state -------------------------------------------------
  // The order that currently has "Share My Location" toggled on (only one at a time).
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  // The agent's own live GPS coordinates, kept in sync via watchPosition.
  const [agentLocation, setAgentLocation] = useState<{ lat: number; lng: number } | null>(null);
  // Ref that holds the watchPosition ID so we can clear it on unmount.
  const watchIdRef = useRef<number | null>(null);
  // Ref that holds the setInterval ID for the 5-second location ping.
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Ref that always mirrors agentLocation so the interval callback can read the
  // latest value without being stale (the interval closure would otherwise capture
  // the value from the render in which it was created).
  const agentLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  // Keep the ref in sync every render.
  agentLocationRef.current = agentLocation;

  // --------------------------------------------------------------------------
  // Watch the device GPS once on mount; stop on unmount.
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setAgentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn("Geolocation watch error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // Start / stop the 5-second location-ping interval whenever activeOrderId changes.
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Clear any previously running interval first.
    if (pingIntervalRef.current !== null) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (activeOrderId === null) return; // nothing to do when sharing is off

    const sendPing = async () => {
      const loc = agentLocationRef.current;
      if (!loc) return; // GPS not yet available; skip this tick
      try {
        await fetch("/api/delivery/location", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: activeOrderId, lat: loc.lat, lng: loc.lng }),
        });
      } catch (err) {
        console.error("Location ping failed:", err);
      }
    };

    // Fire once immediately so there is no 5-second delay on toggle.
    sendPing();
    // Then repeat every 5 seconds.
    pingIntervalRef.current = setInterval(sendPing, 5000);

    // Cleanup: clear interval when activeOrderId changes or component unmounts.
    return () => {
      if (pingIntervalRef.current !== null) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [activeOrderId]);

  // --------------------------------------------------------------------------
  // Toggle helper: turns sharing on for the given order, or off if it is already
  // the active order.  Enforces the single-active-order constraint.
  // --------------------------------------------------------------------------
  const toggleLocationSharing = useCallback((orderId: string) => {
    setActiveOrderId((prev) => (prev === orderId ? null : orderId));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/delivery/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setStats(data.stats || { total: 0, active: 0 });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/delivery/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert("Status updated successfully!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ASSIGNED: "bg-blue-100 text-blue-800",
      PICKED_UP: "bg-purple-100 text-purple-800",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
      DELIVERED: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Deliveries</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Deliveries</p>
                <p className="text-3xl font-bold text-slate-900">{stats.active}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-slate-900">Assigned Orders</h2>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No orders assigned yet</div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-slate-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-primary-600">{formatPrice(order.total)}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{order.user.name}</p>
                        <p className="text-xs text-slate-600">{order.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{order.address.phone}</p>
                    </div>

                    <div className="flex items-start gap-2 md:col-span-2">
                      <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{order.address.address}, {order.address.city}, {order.address.pincode}</p>
                    </div>
                  </div>

                  {order.status !== "DELIVERED" && (
                    <div className="flex gap-2">
                      {order.status === "ASSIGNED" && (
                        <button
                          onClick={() => updateStatus(order.id, "PICKED_UP")}
                          className="btn-primary text-sm"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {order.status === "PICKED_UP" && (
                        <button
                          onClick={() => updateStatus(order.id, "OUT_FOR_DELIVERY")}
                          className="btn-primary text-sm"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === "OUT_FOR_DELIVERY" && (
                        <button
                          onClick={() => updateStatus(order.id, "DELIVERED")}
                          className="btn-primary text-sm"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Location Sharing Toggle
                      Visible only when the order is in an "in-transit" state.
                      -------------------------------------------------------- */}
                  {(order.status === "PICKED_UP" || order.status === "OUT_FOR_DELIVERY") && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleLocationSharing(order.id)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                          activeOrderId === order.id
                            ? "bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                            : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <Navigation
                          className={`h-4 w-4 ${activeOrderId === order.id ? "text-green-600" : "text-slate-500"}`}
                        />
                        {activeOrderId === order.id ? "Sharing Location" : "Share My Location"}
                      </button>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      Map with Directions + Google Maps link
                      Shown when:
                        1. The order is in transit (PICKED_UP | OUT_FOR_DELIVERY)
                        2. The customer address has saved coordinates
                      -------------------------------------------------------- */}
                  {(order.status === "PICKED_UP" || order.status === "OUT_FOR_DELIVERY") &&
                    order.address.customerLat != null &&
                    order.address.customerLng != null && (
                      <div className="mt-5">
                        <MapView
                          customerLocation={{
                            lat: order.address.customerLat,
                            lng: order.address.customerLng,
                          }}
                          agentLocation={agentLocation}
                          showDirections={true}
                          height="300px"
                        />

                        {/* Google Maps directions link – only rendered when the
                            agent's current position is available. */}
                        {agentLocation && (
                          <a
                            href={`https://maps.google.com/?saddr=${agentLocation.lat},${agentLocation.lng}&daddr=${order.address.customerLat},${order.address.customerLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <MapPin className="h-4 w-4" />
                            Open in Google Maps
                          </a>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}

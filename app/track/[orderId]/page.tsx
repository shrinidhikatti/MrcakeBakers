"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTimeline from "@/components/OrderTimeline";
import { haversineDistance, estimateETA, formatETA } from "@/lib/geo";
import { MapPin, Clock, User, Phone, Navigation, RefreshCw } from "lucide-react";

interface TrackingData {
  status: string;
  agentLocation: { lat: number; lng: number } | null;
  customerLocation: { lat: number; lng: number } | null;
  agentName: string | null;
  statusHistory: { status: string; timestamp: string; note?: string }[];
  orderNumber: string;
  deliveryDate: string;
  deliverySlot: string;
  address: string;
  etaMinutes?: number | null;
}

export default function TrackOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setOrderId(p.orderId));
  }, [params]);

  const fetchTracking = async () => {
    if (!orderId) return;
    try {
      // Enhanced tracking API returns all data in one call
      const res = await fetch(`/api/orders/${orderId}/tracking`);
      if (!res.ok) {
        setError("Order not found or access denied");
        setLoading(false);
        return;
      }
      const data = await res.json();

      setTracking({
        status: data.status,
        agentLocation: data.agentLocation,
        customerLocation: data.customerLocation,
        agentName: data.agentName,
        statusHistory: data.statusHistory || [],
        orderNumber: data.orderNumber || "",
        deliveryDate: data.deliveryDate || "",
        deliverySlot: data.deliverySlot || "",
        address: data.address || "",
        etaMinutes: data.etaMinutes || null,
      });
    } catch {
      setError("Failed to load tracking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [orderId]);

  // Calculate ETA - use server value if available, otherwise compute client-side
  let eta: string | null = null;
  if (tracking && ["OUT_FOR_DELIVERY", "PICKED_UP"].includes(tracking.status)) {
    if (tracking.etaMinutes) {
      eta = formatETA(tracking.etaMinutes);
    } else if (tracking.agentLocation && tracking.customerLocation) {
      const distance = haversineDistance(
        tracking.agentLocation.lat,
        tracking.agentLocation.lng,
        tracking.customerLocation.lat,
        tracking.customerLocation.lng
      );
      eta = formatETA(estimateETA(distance));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={session?.user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={session?.user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-bakery-chocolate">{error || "Order not found"}</h2>
            <button onClick={() => router.push("/profile/orders")} className="btn-primary">
              View My Orders
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session?.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-bakery-chocolate">Track Order</h1>
              {tracking.orderNumber && (
                <p className="text-gray-600 mt-1">
                  Order <span className="font-mono font-semibold">{tracking.orderNumber}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {tracking.status !== "DELIVERED" && tracking.status !== "CANCELLED" && (
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </span>
              )}
              <button
                onClick={() => {
                  setLoading(true);
                  fetchTracking();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="md:col-span-2">
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Status</h2>
                <OrderTimeline
                  currentStatus={tracking.status}
                  statusHistory={tracking.statusHistory}
                />
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* ETA Card */}
              {eta && (
                <div className="card bg-primary-50 border border-primary-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-600 font-medium">Estimated Arrival</p>
                      <p className="text-2xl font-bold text-primary-700">{eta}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Partner */}
              {tracking.agentName && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Delivery Partner</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{tracking.agentName}</p>
                      <p className="text-xs text-slate-500">Delivery Partner</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              <div className="card">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Delivery Details</h3>
                <div className="space-y-3">
                  {tracking.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{tracking.address}</p>
                    </div>
                  )}
                  {tracking.deliveryDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {new Date(tracking.deliveryDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {tracking.deliverySlot && ` | ${tracking.deliverySlot}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map preview (if both locations available) */}
              {tracking.agentLocation && tracking.customerLocation && (
                <div className="card">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Live Location</h3>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <Navigation className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">
                      Driver is{" "}
                      <span className="font-semibold text-slate-900">
                        {haversineDistance(
                          tracking.agentLocation.lat,
                          tracking.agentLocation.lng,
                          tracking.customerLocation.lat,
                          tracking.customerLocation.lng
                        ).toFixed(1)}{" "}
                        km
                      </span>{" "}
                      away
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

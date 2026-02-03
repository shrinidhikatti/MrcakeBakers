"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package, User, MapPin, Clock, Truck } from "lucide-react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deliveryPartners, setDeliveryPartners] = useState<any[]>([]);

  useEffect(() => {
    fetchOrder();
    fetchDeliveryPartners();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const response = await fetch("/api/admin/users?role=DELIVERY_PARTNER");
      if (response.ok) {
        const data = await response.json();
        setDeliveryPartners(data);
      }
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const assignDeliveryPartner = async (partnerId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryPartnerId: partnerId,
          status: "ASSIGNED"
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
      PREPARING: "bg-purple-100 text-purple-800 border-purple-300",
      ASSIGNED: "bg-indigo-100 text-indigo-800 border-indigo-300",
      PICKED_UP: "bg-cyan-100 text-cyan-800 border-cyan-300",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800 border-orange-300",
      DELIVERED: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Order not found</p>
          <Link href="/admin/orders" className="text-primary-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                Order Status
              </h2>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      order.status === status
                        ? getStatusColor(status)
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-500" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item: any) => {
                  const img = JSON.parse(item.product.images)[0];
                  const isUrl = img?.startsWith("http");
                  return (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl relative overflow-hidden">
                      {isUrl ? (
                        <Image src={img} alt={item.product.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <span>{img}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-slate-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Assign Delivery Partner */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-slate-500" />
                Delivery Partner
              </h2>
              {order.deliveryPartner ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">{order.deliveryPartner.name}</p>
                  <p className="text-sm text-green-600">{order.deliveryPartner.phone}</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-500 mb-3">No delivery partner assigned yet</p>
                  <select
                    onChange={(e) => e.target.value && assignDeliveryPartner(e.target.value)}
                    disabled={updating}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a delivery partner</option>
                    {deliveryPartners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name} - {partner.phone}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                Customer
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{order.user.name}</p>
                <p className="text-sm text-slate-500">{order.user.email}</p>
                {order.user.phone && (
                  <p className="text-sm text-slate-500">{order.user.phone}</p>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-500" />
                Delivery Address
              </h2>
              <div className="text-sm text-slate-600 space-y-1">
                <p>{order.address}</p>
                <p>{order.city}, {order.state} {order.pincode}</p>
              </div>
              {order.deliverySlot && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-slate-500">Delivery Slot</p>
                  <p className="font-medium">{order.deliverySlot}</p>
                </div>
              )}
              {order.specialInstructions && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-slate-500">Special Instructions</p>
                  <p className="text-sm">{order.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Delivery Map */}
            {(order.address?.customerLat != null || order.agentLat != null) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  Delivery Map
                </h2>
                <MapView
                  customerLocation={
                    order.address?.customerLat != null && order.address?.customerLng != null
                      ? { lat: order.address.customerLat, lng: order.address.customerLng }
                      : null
                  }
                  agentLocation={
                    order.agentLat != null && order.agentLng != null
                      ? { lat: order.agentLat, lng: order.agentLng }
                      : null
                  }
                  showDirections={order.agentLat != null && order.address?.customerLat != null}
                  height="250px"
                />
                <div className="mt-3 flex gap-4 text-xs text-slate-500">
                  {order.address?.customerLat != null && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> Customer
                    </span>
                  )}
                  {order.agentLat != null && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Agent
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Fee</span>
                  <span>{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-slate-500">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

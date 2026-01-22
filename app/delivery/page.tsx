"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, MapPin, Phone, User } from "lucide-react";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Delivery Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your delivery assignments</p>
            </div>
            <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>

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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

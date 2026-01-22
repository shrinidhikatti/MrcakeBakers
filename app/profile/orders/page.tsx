"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";
import { Package, Calendar } from "lucide-react";

export default function ProfileOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PREPARING: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-bakery-chocolate mb-8">My Orders</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="card text-center py-20">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-bakery-chocolate mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">Start shopping to create your first order</p>
              <a href="/products" className="btn-primary inline-block">
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-bakery-chocolate">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="h-5 w-5 flex-shrink-0" />
                      <span>
                        Delivery: {new Date(order.deliveryDate).toLocaleDateString()} - {order.deliverySlot}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item: any) => {
                      const images = JSON.parse(item.product.images);
                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-pink-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                            {images[0]}
                          </div>
                          <div className="flex-grow">
                            <p className="font-semibold text-bakery-chocolate">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-bakery-chocolate">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="text-2xl font-bold text-primary-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

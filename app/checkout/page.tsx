"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    deliveryDate: "",
    deliverySlot: "9AM-12PM",
    specialInstructions: "",
  });
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [locationMethod, setLocationMethod] = useState<"gps" | "geocode" | null>(null);

  const subtotal = getTotal();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const getLocation = () => {
    setLocationMethod("gps");
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("success");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const geocodeAddress = async () => {
    setLocationMethod("geocode");
    setLocationStatus("loading");
    try {
      const query = `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}, India`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        setCustomerLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        setLocationStatus("success");
      } else {
        setLocationStatus("error");
      }
    } catch {
      setLocationStatus("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        customerLat: customerLocation?.lat ?? null,
        customerLng: customerLocation?.lng ?? null,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={session?.user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-bakery-chocolate">Your cart is empty</h2>
            <p className="text-gray-600">Add some items to your cart before checking out</p>
            <button onClick={() => router.push("/products")} className="btn-primary">
              Browse Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get tomorrow's date as minimum delivery date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session?.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-bakery-chocolate mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-bakery-chocolate mb-6 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary-600" />
                    Delivery Address
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        className="input"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="Street address, building, apartment"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        className="input"
                        placeholder="560001"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>

                    {/* Precise Location */}
                    <div className="md:col-span-2 mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Location
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        {/* GPS Button */}
                        <button
                          type="button"
                          onClick={getLocation}
                          disabled={locationStatus === "loading" && locationMethod === "gps"}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            locationMethod === "gps" && locationStatus === "success"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : locationMethod === "gps" && locationStatus === "error"
                              ? "bg-red-100 text-red-700 border border-red-300"
                              : "bg-primary-100 text-primary-700 border border-primary-300 hover:bg-primary-200"
                          }`}
                        >
                          {locationMethod === "gps" && locationStatus === "loading" ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                              Getting Location...
                            </>
                          ) : locationMethod === "gps" && locationStatus === "success" ? (
                            <>📍 GPS Captured</>
                          ) : locationMethod === "gps" && locationStatus === "error" ? (
                            <>⚠️ GPS Failed — Retry</>
                          ) : (
                            <>📍 Get My Precise Location</>
                          )}
                        </button>

                        <span className="text-xs text-gray-400 font-medium">or</span>

                        {/* Geocode from Address Button */}
                        <button
                          type="button"
                          onClick={geocodeAddress}
                          disabled={(locationStatus === "loading" && locationMethod === "geocode") || !formData.address || !formData.city}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            locationMethod === "geocode" && locationStatus === "success"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : locationMethod === "geocode" && locationStatus === "error"
                              ? "bg-red-100 text-red-700 border border-red-300"
                              : !formData.address || !formData.city
                              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                              : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {locationMethod === "geocode" && locationStatus === "loading" ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                              Finding Location...
                            </>
                          ) : locationMethod === "geocode" && locationStatus === "success" ? (
                            <>🗺️ Address Located</>
                          ) : locationMethod === "geocode" && locationStatus === "error" ? (
                            <>⚠️ Not Found — Retry</>
                          ) : (
                            <>🗺️ Use My Address</>
                          )}
                        </button>
                      </div>
                      {locationStatus === "success" && customerLocation && (
                        <p className="text-xs text-green-600 mt-1">
                          Location saved: {customerLocation.lat.toFixed(6)}, {customerLocation.lng.toFixed(6)}
                          {locationMethod === "geocode" && <span className="text-gray-500 ml-1">(approximate)</span>}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {!formData.address || !formData.city
                          ? "Fill in your address above to enable address-based location."
                          : locationMethod === "geocode" && locationStatus === "success"
                          ? "Approximate location from your address. Use GPS for precise location."
                          : "Use GPS for precise location, or use your typed address for an approximate location."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Schedule */}
                <div className="card">
                  <h2 className="text-2xl font-bold text-bakery-chocolate mb-6 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary-600" />
                    Delivery Schedule
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        className="input"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Time Slot *
                      </label>
                      <select
                        required
                        className="input"
                        value={formData.deliverySlot}
                        onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                      >
                        <option value="9AM-12PM">9 AM - 12 PM</option>
                        <option value="12PM-3PM">12 PM - 3 PM</option>
                        <option value="3PM-6PM">3 PM - 6 PM</option>
                        <option value="6PM-9PM">6 PM - 9 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="input"
                      placeholder="Any special requests for your order..."
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card sticky top-24 space-y-6">
                  <h2 className="text-2xl font-bold text-bakery-chocolate border-b border-gray-200 pb-4">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => {
                      const isUrl = item.image?.startsWith('http');
                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-pink-50 rounded-lg overflow-hidden flex items-center justify-center text-2xl flex-shrink-0 relative">
                            {isUrl ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <span>{item.image}</span>
                            )}
                          </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-sm text-bakery-chocolate">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-bakery-chocolate">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-bakery-chocolate">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Placing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Payment: Cash on Delivery
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

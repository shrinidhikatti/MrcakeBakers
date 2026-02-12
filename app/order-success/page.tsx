"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    setOrderId(id);
  }, [searchParams]);

  return (
    <main className="flex-grow flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8 animate-fadeIn">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-bakery-chocolate">
            Order Placed Successfully!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We'll start preparing your delicious treats right away!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card text-left space-y-4">
          <div className="flex items-center gap-3 text-primary-600">
            <Package className="h-6 w-6" />
            <h2 className="text-xl font-bold">Order Confirmed</h2>
          </div>

          {orderId && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                Order ID: <span className="font-mono font-semibold text-bakery-chocolate">{orderId}</span>
              </p>
              <p className="text-gray-600">
                You will receive an order confirmation email with details of your order.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <h3 className="font-semibold text-bakery-chocolate">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>We'll confirm your order within 30 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Your treats will be freshly prepared on the delivery day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>We'll deliver during your selected time slot</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Payment on delivery (Cash on Delivery)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderId && (
            <button
              onClick={() => router.push(`/track/${orderId}`)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Track Order
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => router.push("/profile")}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            View My Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="btn-secondary"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-sm text-left">
          <h3 className="font-semibold text-bakery-chocolate mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-3">
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex flex-wrap gap-4 text-primary-600 font-medium">
            <a href="/contact" className="hover:text-primary-700">Contact Us</a>
            <span className="text-gray-300">|</span>
            <a href="tel:+919876543210" className="hover:text-primary-700">+91 98765 43210</a>
            <span className="text-gray-300">|</span>
            <a href="mailto:hello@mrcake.com" className="hover:text-primary-700">hello@mrcake.com</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session?.user} />
      <Suspense fallback={
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}

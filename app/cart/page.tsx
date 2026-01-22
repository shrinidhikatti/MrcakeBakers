"use client";

import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();
  const deliveryFee = total > 500 ? 0 : 50;
  const finalTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-bakery-chocolate">Your Cart is Empty</h2>
            <p className="text-lg text-gray-600">
              Start shopping to add items to your cart
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-bakery-chocolate mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-pink-50 rounded-lg flex items-center justify-center flex-shrink-0 text-4xl">
                    {item.image}
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg text-bakery-chocolate mb-1">
                      {item.name}
                    </h3>
                    <p className="text-primary-600 font-bold text-xl">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remove & Subtotal */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p className="font-bold text-xl text-bakery-chocolate">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24 space-y-4">
                <h2 className="text-2xl font-bold text-bakery-chocolate border-b border-gray-200 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
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

                  {deliveryFee > 0 && total < 500 && (
                    <p className="text-sm text-gray-500">
                      Add {formatPrice(500 - total)} more for free delivery
                    </p>
                  )}

                  <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-bakery-chocolate">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full btn-primary block text-center">
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="w-full btn-secondary block text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import SearchBar from "@/components/SearchBar";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-xl shadow-lg">
              MC
            </div>
            <span className="text-2xl font-bold text-bakery-chocolate">
              Mr<span className="text-primary-600">.Cake</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === "DELIVERY_PARTNER" && (
                  <Link
                    href="/delivery"
                    className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Delivery Dashboard
                  </Link>
                )}
                <Link
                  href="/wishlist"
                  className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                >
                  <Heart className="h-6 w-6" />
                </Link>
                <Link
                  href="/cart"
                  className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 rounded-full py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded-full p-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slideInRight">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === "DELIVERY_PARTNER" && (
                    <Link
                      href="/delivery"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100"
                    >
                      Delivery Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

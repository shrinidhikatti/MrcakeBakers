import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

export default async function WishlistPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-bakery-chocolate mb-8">My Wishlist</h1>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-bakery-chocolate mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items for later
            </p>
            <a href="/products" className="btn-primary">
              Browse Products
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

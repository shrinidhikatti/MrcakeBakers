import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Package, MapPin } from "lucide-react";
import ProfileEditor from "@/components/ProfileEditor";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-bakery-chocolate mb-8">My Profile</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="card space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-bakery-chocolate">
                      {session.user.name}
                    </h2>
                    <p className="text-sm text-gray-600">{session.user.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary-50 text-primary-600 font-medium"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </a>
                  <a
                    href="/profile/orders"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Package className="h-5 w-5" />
                    My Orders
                  </a>
                  <a
                    href="/profile/addresses"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </a>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-bold text-bakery-chocolate mb-6">
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg text-bakery-chocolate">{session.user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-lg text-bakery-chocolate">{session.user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                      {session.user.role}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-bakery-chocolate mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a href="/products" className="btn-primary">
                      Continue Shopping
                    </a>
                    <a href="/wishlist" className="btn-secondary">
                      View Wishlist
                    </a>
                  </div>
                </div>

                <ProfileEditor />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

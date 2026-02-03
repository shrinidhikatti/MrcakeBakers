import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, ArrowLeft } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    include: {
      orders: {
        select: { id: true, orderNumber: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/profile" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-4xl font-bold text-bakery-chocolate">My Addresses</h1>
          </div>

          {addresses.length === 0 ? (
            <div className="card text-center py-16">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-bakery-chocolate mb-2">No addresses yet</h2>
              <p className="text-gray-600">
                Your delivery addresses will appear here after you place your first order.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-100 p-2 rounded-lg mt-0.5">
                        <MapPin className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-bakery-chocolate">{addr.fullName}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{addr.phone}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {addr.address}, {addr.city}, {addr.state} {addr.pincode}
                        </p>
                        {addr.customerLat != null && addr.customerLng != null && (
                          <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            GPS saved: {addr.customerLat.toFixed(4)}, {addr.customerLng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>

                    {addr.orders.length > 0 && (
                      <Link
                        href="/profile/orders"
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap bg-primary-50 px-2.5 py-1 rounded-full"
                      >
                        {addr.orders[0].orderNumber}
                      </Link>
                    )}
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

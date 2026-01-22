import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function MenuPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary-600 to-pink-600 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl text-primary-100">
              Explore our complete range of delicious offerings
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="text-6xl">📋</div>
            <h2 className="text-3xl font-bold text-bakery-chocolate">
              Complete Menu Coming Soon
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're preparing our detailed menu with all our offerings. In the meantime,
              check out our products page to see what's available!
            </p>
            <a
              href="/products"
              className="btn-primary inline-block"
            >
              View Products
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

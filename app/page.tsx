import Link from "next/link";
import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cake, Clock, ShieldCheck, Truck, ChevronRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const session = await auth();

  // Get featured products
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, inStock: true },
    take: 4,
    include: { category: true },
  });

  const features = [
    {
      icon: Cake,
      title: "Artisan Baked",
      description: "Handcrafted with premium ingredients",
    },
    {
      icon: Clock,
      title: "Fresh Daily",
      description: "Baked fresh every morning",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same-day delivery available",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "100% satisfaction guaranteed",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 via-pink-50 to-orange-50 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fadeIn">
                <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  ✨ Freshly Baked with Love
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-bakery-chocolate leading-tight">
                  Sweet Moments <br />
                  <span className="text-primary-600">Delivered Fresh</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-xl">
                  Discover our handcrafted cakes, pastries, and breads. Made fresh daily with premium ingredients and delivered right to your doorstep.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/products" className="btn-primary inline-flex items-center">
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="/menu" className="btn-secondary">
                    View Menu
                  </Link>
                </div>
              </div>

              <div className="relative h-[400px] md:h-[500px] animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-pink-400 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-pink-500 rounded-3xl transform -rotate-3 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 md:w-96 md:h-96 bg-white rounded-full shadow-2xl flex items-center justify-center text-9xl">
                    🎂
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-bakery-chocolate">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-bakery-cream">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-bold text-bakery-chocolate">
                  Featured Favorites
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our most loved creations, handpicked just for you
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => {
                  const images = JSON.parse(product.images);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group"
                    >
                      <div className="card overflow-hidden">
                        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
                          {images[0] && (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              {images[0]}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                          <h3 className="font-semibold text-bakery-chocolate group-hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-2xl font-bold text-primary-600">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {product.category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <Link href="/products" className="btn-primary">
                  View All Products
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-pink-600 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Satisfy Your Sweet Tooth?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Order now and get your favorite treats delivered fresh to your door. Same-day delivery available!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                Start Shopping
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

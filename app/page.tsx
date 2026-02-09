import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSelector from "@/components/heroes/HeroSelector";
import { Cake, Clock, ShieldCheck, Truck, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { unstable_cache } from "next/cache";

const getFeaturedProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { featured: true, inStock: true },
      take: 4,
      include: { category: true },
    });
  },
  ["featured-products"],
  { revalidate: 60 }
);

export default async function HomePage() {
  const session = await auth();

  const featuredProducts = await getFeaturedProducts();

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
        {/* Hero Section - Dynamically selected by admin */}
        <HeroSelector />

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-bakery-chocolate">
                Why Choose Mr.Cake
              </h2>
              <div className="mt-3 mx-auto w-16 h-1 bg-primary-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all bg-white"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center shadow-sm">
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

        {/* Stats Strip */}
        <section className="bg-gradient-to-r from-bakery-chocolate via-[#6B3A38] to-bakery-chocolate py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { number: "500+", label: "Happy Customers" },
                { number: "1,000+", label: "Cakes Delivered" },
                { number: "10+", label: "Years Experience" },
                { number: "24/7", label: "Fresh & Available" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-white">{stat.number}</p>
                  <p className="text-sm text-primary-300 mt-1">{stat.label}</p>
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
                <div className="mx-auto w-16 h-1 bg-primary-600 rounded-full"></div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our most loved creations, handpicked just for you
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => {
                  const images = JSON.parse(product.images);
                  const firstImage = images[0];
                  const isUrl = firstImage?.startsWith('http');
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group"
                    >
                      <div className="card overflow-hidden border border-gray-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-primary-50 to-pink-50">
                          {firstImage && (
                            isUrl ? (
                              <Image
                                src={firstImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                priority={index < 2}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                                {firstImage}
                              </div>
                            )
                          )}
                          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                            ✨ Featured
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
        <section
          className="relative py-24 text-white bg-cover bg-center"
          style={{ backgroundImage: "url('/b3.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/55"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white/90">
              🎂 Limited Time Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
              Ready to Satisfy Your Sweet Tooth?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              Order now and get your favorite treats delivered fresh to your door. Same-day delivery available!
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/products"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Start Shopping
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all active:scale-95"
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

import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import { ChevronRight } from "lucide-react";

export default function HeroVariant1() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-pink-50 to-orange-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      {/* Floating decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-20 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-orange-200 rounded-full blur-2xl opacity-25"></div>
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

          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}

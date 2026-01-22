import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductsPage() {
  const session = await auth();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { inStock: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary-600 to-pink-600 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-primary-100">
              Discover our delicious selection of freshly baked goods
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="px-5 py-2 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="px-5 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-medium hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No products found.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await auth();
  const params = await searchParams;
  const categorySlug = params.category;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        inStock: true,
        ...(categorySlug && {
          category: {
            slug: categorySlug,
          },
        }),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div
          className="text-white py-16 bg-cover bg-center"
          style={{ backgroundImage: "url('/b1.png')" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-xl text-white/90">
              Discover our delicious selection of freshly baked goods
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className={`px-5 py-2 rounded-full font-medium transition-colors ${
                !categorySlug
                  ? "bg-primary-600 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600"
              }`}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${
                  categorySlug === category.slug
                    ? "bg-primary-600 text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600"
                }`}
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
              <p className="text-xl text-gray-600">No products found in this category.</p>
              <Link href="/products" className="text-primary-600 hover:underline mt-2 inline-block">
                View all products
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

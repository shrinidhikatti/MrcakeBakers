import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { unstable_cache } from "next/cache";

const getProductsAndCategories = unstable_cache(
  async (categorySlug?: string) => {
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
    return { products, categories };
  },
  ["products-page"],
  { revalidate: 60 }
);

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await auth();
  const params = await searchParams;
  const categorySlug = params.category;

  const { products, categories } = await getProductsAndCategories(categorySlug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div
          className="relative text-white py-16 bg-cover bg-center"
          style={{ backgroundImage: "url('/b1.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/55"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Our Products</h1>
            <div className="mt-3 mx-auto w-16 h-1 bg-white rounded-full opacity-80"></div>
            <p className="text-xl text-white/90 mt-4 drop-shadow">
              Discover our delicious selection of freshly baked goods
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3 pb-6 border-b border-gray-200">
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
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
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

import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getProductsAndCategories(filters: {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  inStock?: boolean;
}) {
  const { categorySlug, search, minPrice, maxPrice, sort, inStock } = filters;

  // Build where clause
  const where: any = {};

  // Category filter
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Stock filter
  if (inStock) {
    where.inStock = true;
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }; // default

  switch (sort) {
    case 'price-low':
      orderBy = { price: 'asc' };
      break;
    case 'price-high':
      orderBy = { price: 'desc' };
      break;
    case 'name-asc':
      orderBy = { name: 'asc' };
      break;
    case 'name-desc':
      orderBy = { name: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  // Fetch products and categories
  const [products, categories, priceStats] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
    }),
    prisma.category.findMany(),
    prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  return {
    products,
    categories,
    minPrice: priceStats._min.price || 0,
    maxPrice: priceStats._max.price || 10000,
  };
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await auth();
  const params = await searchParams;

  const filters = {
    categorySlug: params.category,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort: params.sort,
    inStock: params.inStock === 'true',
  };

  const { products, categories, minPrice, maxPrice } = await getProductsAndCategories(filters);

  const activeFiltersCount = [
    params.search,
    params.minPrice,
    params.maxPrice,
    params.sort && params.sort !== 'newest',
    params.inStock,
  ].filter(Boolean).length;

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
                !params.category
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
                  params.category === category.slug
                    ? "bg-primary-600 text-white"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-600 hover:text-primary-600"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search & Filters */}
          <ProductFilters minPrice={minPrice} maxPrice={maxPrice} />

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold">{products.length}</span> product{products.length !== 1 && 's'} found
              {activeFiltersCount > 0 && (
                <span className="ml-2 text-sm">
                  ({activeFiltersCount} filter{activeFiltersCount !== 1 && 's'} applied)
                </span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {params.search
                  ? `No results for "${params.search}"`
                  : "Try adjusting your filters or browse all products"}
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

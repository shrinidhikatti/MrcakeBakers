import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function MenuPage() {
  const session = await auth();

  // Fetch categories with their products
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { inStock: true },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session?.user} />

      <main className="flex-grow">
        <div
          className="text-white py-16 bg-cover bg-center"
          style={{ backgroundImage: "url('/b3.png')" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl text-white/90">
              Explore our complete range of delicious offerings
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {categories.map((category) => (
            <div key={category.id} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-bakery-chocolate">
                  {category.name}
                </h2>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100">
                    {category.products.length > 0 ? (
                      category.products.map((product) => {
                        const images = product.images;
                        let firstImage = '🍰';
                        try {
                          const parsed = JSON.parse(images);
                          firstImage = parsed[0] || '🍰';
                        } catch {
                          firstImage = images || '🍰';
                        }

                        const isUrl = firstImage?.startsWith('http');

                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                {isUrl ? (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary-50 to-pink-50 flex-shrink-0 relative">
                                    <Image
                                      src={firstImage}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                      sizes="64px"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-3xl">{firstImage}</span>
                                )}
                                <div>
                                  <Link
                                    href={`/products/${product.slug}`}
                                    className="font-semibold text-bakery-chocolate hover:text-primary-600"
                                  >
                                    {product.name}
                                  </Link>
                                  <p className="text-sm text-gray-500 line-clamp-1">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-lg font-bold text-primary-600">
                                {formatPrice(product.price)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                          No products available in this category
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍰</div>
              <p className="text-xl text-gray-600">Menu items coming soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

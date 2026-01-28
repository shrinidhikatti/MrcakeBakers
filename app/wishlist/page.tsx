'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Trash2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    inStock: boolean;
    category: {
      name: string;
    };
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.productId !== productId));
      } else {
        alert('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist');
    }
  };

  const isEmoji = (str: string | undefined | null) => {
    if (!str) return false;
    return str.length <= 4 && !/^https?:\/\//.test(str) && !/^\//.test(str);
  };

  const getProductImage = (product: WishlistItem['product']) => {
    const images = (product as any).images || product.image || '🍰';
    try {
      const parsed = JSON.parse(images);
      return parsed[0] || '🍰';
    } catch {
      return images || '🍰';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <Header user={session?.user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wishlist...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header user={session?.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Save your favorite items for later
              </p>
              <Link href="/products" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <Link href={`/products/${item.product.slug}`}>
                    <div className="aspect-square bg-cream-100 flex items-center justify-center">
                      {isEmoji(getProductImage(item.product)) ? (
                        <span className="text-8xl">{getProductImage(item.product)}</span>
                      ) : (
                        <Image
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.product.category.name}
                    </p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{item.product.price}
                      </span>
                      {item.product.inStock ? (
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                        >
                          View Product
                        </Link>
                      ) : (
                        <span className="text-sm text-red-600 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </div>
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

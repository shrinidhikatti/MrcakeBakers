"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, ShoppingCart, Heart, Star, Package, Clock, Award } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  inStock: boolean;
  weight?: string;
  servings?: string;
  ingredients?: string;
  allergens?: string;
  category: {
    name: string;
  };
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const images = JSON.parse(product.images);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: images[0],
    });

    alert(`${quantity} ${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={session?.user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={session?.user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-bakery-chocolate">Product Not Found</h2>
            <button onClick={() => router.push("/products")} className="btn-primary">
              Back to Products
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = JSON.parse(product.images);
  const firstImage = images[0];
  const isUrl = firstImage?.startsWith('http');

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session?.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary-600">Products</a>
            <span>/</span>
            <span className="text-bakery-chocolate font-medium">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-pink-50 rounded-2xl overflow-hidden shadow-lg relative">
                {isUrl ? (
                  <Image
                    src={firstImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-9xl">
                    {firstImage}
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img: string, index: number) => {
                    const isImgUrl = img?.startsWith('http');
                    return (
                      <div
                        key={index}
                        className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-500 cursor-pointer transition-colors relative"
                      >
                        {isImgUrl ? (
                          <Image
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {img}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-3">
                  {product.category.name}
                </span>
                <h1 className="text-4xl font-bold text-bakery-chocolate mb-3">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(24 reviews)</span>
                </div>
                <p className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-lg text-gray-700">{product.description}</p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Package className="h-6 w-6 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="font-semibold text-bakery-chocolate">{product.weight}</p>
                    </div>
                  </div>
                )}
                {product.servings && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Clock className="h-6 w-6 text-primary-600" />
                    <div>
                      <p className="text-xs text-gray-500">Servings</p>
                      <p className="font-semibold text-bakery-chocolate">{product.servings}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-bakery-chocolate mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary-600" />
                    Ingredients
                  </h3>
                  <p className="text-sm text-gray-600">{product.ingredients}</p>
                </div>
              )}

              {/* Allergens */}
              {product.allergens && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">⚠️ Allergen Information</h3>
                  <p className="text-sm text-red-700">{product.allergens}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-2 border-2 border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="font-bold text-2xl w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">Subtotal: {formatPrice(product.price * quantity)}</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 text-lg py-4"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="btn-secondary w-14 h-14 flex items-center justify-center p-0">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              {product.inStock && (
                <p className="text-sm text-green-600 font-medium">✓ In Stock - Ships Today</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

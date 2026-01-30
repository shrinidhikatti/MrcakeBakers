"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import WishlistButton from "@/components/WishlistButton";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  featured: boolean;
  category: {
    name: string;
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const images = JSON.parse(product.images);
  const firstImage = images[0];
  const isUrl = firstImage?.startsWith('http');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: images[0],
    });

    // Simple notification (you can replace with a toast library)
    alert(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="card h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-primary-50 to-pink-50">
          {isUrl ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {firstImage}
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
            <WishlistButton productId={product.id} />
          </div>
        </div>
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </div>
          <h3 className="font-semibold text-bakery-chocolate group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between pt-4 mt-auto">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category.name}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

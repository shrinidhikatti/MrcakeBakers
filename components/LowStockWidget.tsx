"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface LowStockProduct {
  id: string;
  name: string;
  quantity: number;
  lowStockAlert: number;
  category: { name: string };
}

export default function LowStockWidget() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/analytics?days=30");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.lowStockProducts || []);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-slate-900">Low Stock Alerts</h2>
          <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {products.length} items
          </span>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {products.slice(0, 5).map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}/edit`}
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">{product.name}</p>
              <p className="text-xs text-slate-500">{product.category.name}</p>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  product.quantity <= 0
                    ? "text-red-600"
                    : product.quantity <= product.lowStockAlert
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {product.quantity} left
              </span>
              {product.quantity <= 0 && (
                <p className="text-xs text-red-500 font-medium">Out of Stock</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

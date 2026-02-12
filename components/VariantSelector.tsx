"use client";

import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  type: string;
  name: string;
  priceModifier: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  selected: Record<string, string>; // { SIZE: variantId, FLAVOR: variantId }
  onSelect: (type: string, variantId: string) => void;
  basePrice: number;
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
  basePrice,
}: VariantSelectorProps) {
  // Group variants by type
  const grouped: Record<string, Variant[]> = {};
  variants.forEach((v) => {
    if (!grouped[v.type]) grouped[v.type] = [];
    grouped[v.type].push(v);
  });

  const typeLabels: Record<string, string> = {
    SIZE: "Size",
    FLAVOR: "Flavor",
    LAYER: "Layers",
  };

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([type, typeVariants]) => (
        <div key={type}>
          <label className="block text-sm font-semibold text-bakery-chocolate mb-2">
            {typeLabels[type] || type}
          </label>
          <div className="flex flex-wrap gap-2">
            {typeVariants.map((variant) => {
              const isSelected = selected[type] === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelect(type, variant.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span>{variant.name}</span>
                  {variant.priceModifier !== 0 && (
                    <span className={`ml-1 text-xs ${variant.priceModifier > 0 ? "text-green-600" : "text-red-500"}`}>
                      {variant.priceModifier > 0 ? "+" : ""}
                      {formatPrice(variant.priceModifier)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

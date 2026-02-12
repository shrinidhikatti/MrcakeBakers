"use client";

import { CAKE_FLAVORS } from "@/lib/cakeBuilderConfig";
import { formatPrice } from "@/lib/utils";

interface FlavorSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function FlavorSelector({ selected, onSelect }: FlavorSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-3">Flavor</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CAKE_FLAVORS.map((flavor) => (
          <button
            key={flavor.id}
            onClick={() => onSelect(flavor.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              selected === flavor.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: flavor.color }}
            />
            <div>
              <p className="text-sm font-medium text-slate-900">{flavor.name}</p>
              <p className="text-xs text-gray-500">
                {flavor.price === 0 ? "Included" : `+${formatPrice(flavor.price)}`}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

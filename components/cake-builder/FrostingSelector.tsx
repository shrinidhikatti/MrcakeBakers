"use client";

import { CAKE_FROSTINGS } from "@/lib/cakeBuilderConfig";
import { formatPrice } from "@/lib/utils";

interface FrostingSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function FrostingSelector({ selected, onSelect }: FrostingSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-3">Frosting</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CAKE_FROSTINGS.map((frosting) => (
          <button
            key={frosting.id}
            onClick={() => onSelect(frosting.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              selected === frosting.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: frosting.color }}
            />
            <div>
              <p className="text-sm font-medium text-slate-900">{frosting.name}</p>
              <p className="text-xs text-gray-500">
                {frosting.price === 0 ? "Included" : `+${formatPrice(frosting.price)}`}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

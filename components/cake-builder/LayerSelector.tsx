"use client";

import { CAKE_LAYERS } from "@/lib/cakeBuilderConfig";
import { formatPrice } from "@/lib/utils";

interface LayerSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function LayerSelector({ selected, onSelect }: LayerSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-3">Layers</h3>
      <div className="grid grid-cols-3 gap-3">
        {CAKE_LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onSelect(layer.id)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selected === layer.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">
              {"🎂".repeat(parseInt(layer.id))}
            </div>
            <p className="text-sm font-medium text-slate-900">{layer.name}</p>
            <p className="text-xs text-gray-500">
              {layer.price === 0 ? "Included" : `+${formatPrice(layer.price)}`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

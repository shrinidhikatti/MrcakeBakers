"use client";

import { CAKE_TOPPINGS } from "@/lib/cakeBuilderConfig";
import { formatPrice } from "@/lib/utils";

interface ToppingSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export default function ToppingSelector({ selected, onToggle }: ToppingSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-3">
        Toppings <span className="text-sm font-normal text-gray-500">(select multiple)</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CAKE_TOPPINGS.map((topping) => {
          const isSelected = selected.includes(topping.id);
          return (
            <button
              key={topping.id}
              onClick={() => onToggle(topping.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{topping.emoji}</div>
              <p className="text-xs font-medium text-slate-900">{topping.name}</p>
              <p className="text-xs text-gray-500">+{formatPrice(topping.price)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

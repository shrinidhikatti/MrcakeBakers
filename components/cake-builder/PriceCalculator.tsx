"use client";

import {
  CakeConfig,
  calculateCakePrice,
  BASE_PRICE,
  CAKE_LAYERS,
  CAKE_FLAVORS,
  CAKE_FROSTINGS,
  CAKE_TOPPINGS,
} from "@/lib/cakeBuilderConfig";
import { formatPrice } from "@/lib/utils";

interface PriceCalculatorProps {
  config: CakeConfig;
}

export default function PriceCalculator({ config }: PriceCalculatorProps) {
  const total = calculateCakePrice(config);

  const layer = CAKE_LAYERS.find((l) => l.id === config.layers);
  const flavor = CAKE_FLAVORS.find((f) => f.id === config.flavor);
  const frosting = CAKE_FROSTINGS.find((f) => f.id === config.frosting);
  const selectedToppings = config.toppings
    .map((id) => CAKE_TOPPINGS.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-bakery-chocolate">Price Breakdown</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Base cake</span>
          <span className="font-medium">{formatPrice(BASE_PRICE)}</span>
        </div>

        {layer && layer.price > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">{layer.name}</span>
            <span className="font-medium">+{formatPrice(layer.price)}</span>
          </div>
        )}

        {flavor && flavor.price > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">{flavor.name} flavor</span>
            <span className="font-medium">+{formatPrice(flavor.price)}</span>
          </div>
        )}

        {frosting && frosting.price > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">{frosting.name} frosting</span>
            <span className="font-medium">+{formatPrice(frosting.price)}</span>
          </div>
        )}

        {selectedToppings.map((topping) => (
          <div key={topping!.id} className="flex justify-between">
            <span className="text-gray-600">{topping!.emoji} {topping!.name}</span>
            <span className="font-medium">+{formatPrice(topping!.price)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-between">
        <span className="text-lg font-bold text-bakery-chocolate">Total</span>
        <span className="text-2xl font-bold text-primary-600">{formatPrice(total)}</span>
      </div>
    </div>
  );
}

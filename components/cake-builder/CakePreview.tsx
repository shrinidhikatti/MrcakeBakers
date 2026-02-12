"use client";

import {
  CAKE_LAYERS,
  CAKE_FLAVORS,
  CAKE_FROSTINGS,
  CAKE_TOPPINGS,
} from "@/lib/cakeBuilderConfig";

interface CakePreviewProps {
  layers: string;
  flavor: string;
  frosting: string;
  toppings: string[];
  message: string;
}

export default function CakePreview({
  layers,
  flavor,
  frosting,
  toppings,
  message,
}: CakePreviewProps) {
  const layerConfig = CAKE_LAYERS.find((l) => l.id === layers) || CAKE_LAYERS[0];
  const flavorConfig = CAKE_FLAVORS.find((f) => f.id === flavor) || CAKE_FLAVORS[0];
  const frostingConfig = CAKE_FROSTINGS.find((f) => f.id === frosting) || CAKE_FROSTINGS[0];

  const numLayers = parseInt(layers) || 1;
  const layerHeight = 45;
  const totalHeight = numLayers * layerHeight + 30; // 30px for plate
  const cakeWidth = 200;

  const selectedToppings = toppings
    .map((id) => CAKE_TOPPINGS.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[350px]">
      {/* Toppings on top */}
      {selectedToppings.length > 0 && (
        <div className="flex gap-1 mb-1 text-xl">
          {selectedToppings.map((t) => (
            <span key={t!.id} title={t!.name}>
              {t!.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Cake layers */}
      <div className="relative" style={{ width: cakeWidth }}>
        {Array.from({ length: numLayers }).map((_, i) => {
          const layerWidth = cakeWidth - i * 20;
          const isTop = i === 0;
          return (
            <div
              key={i}
              className="mx-auto relative"
              style={{
                width: layerWidth,
                height: layerHeight,
              }}
            >
              {/* Frosting (border/top) */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: frostingConfig.color,
                  border: `3px solid ${frostingConfig.color === "#FFFFFF" ? "#e5e7eb" : frostingConfig.color}`,
                  filter: "brightness(0.95)",
                }}
              />
              {/* Cake fill */}
              <div
                className="absolute rounded-md"
                style={{
                  top: 4,
                  left: 4,
                  right: 4,
                  bottom: 4,
                  backgroundColor: flavorConfig.color,
                }}
              />
              {/* Message on middle layer */}
              {i === Math.floor(numLayers / 2) && message && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded max-w-full truncate"
                    style={{
                      color:
                        flavorConfig.color === "#5C3317" ||
                        flavorConfig.color === "#3B2F2F" ||
                        flavorConfig.color === "#C41E3A"
                          ? "#fff"
                          : "#4a2c2a",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {message}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Cake plate */}
        <div
          className="mx-auto mt-1 rounded-b-xl"
          style={{
            width: cakeWidth + 20,
            height: 12,
            backgroundColor: "#d4a574",
            marginLeft: -10,
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Labels */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{layerConfig.name}</span> {flavorConfig.name} cake
        </p>
        <p className="text-sm text-gray-500">
          {frostingConfig.name} frosting
        </p>
        {selectedToppings.length > 0 && (
          <p className="text-xs text-gray-400">
            {selectedToppings.map((t) => t!.name).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

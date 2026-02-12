"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LayerSelector from "@/components/cake-builder/LayerSelector";
import FlavorSelector from "@/components/cake-builder/FlavorSelector";
import FrostingSelector from "@/components/cake-builder/FrostingSelector";
import ToppingSelector from "@/components/cake-builder/ToppingSelector";
import MessageInput from "@/components/cake-builder/MessageInput";
import ImageUploader from "@/components/cake-builder/ImageUploader";
import CakePreview from "@/components/cake-builder/CakePreview";
import PriceCalculator from "@/components/cake-builder/PriceCalculator";
import { useCartStore } from "@/store/cartStore";
import { calculateCakePrice, CakeConfig } from "@/lib/cakeBuilderConfig";
import { ShoppingCart, Cake } from "lucide-react";

export default function CakeBuilderPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);

  const [config, setConfig] = useState<CakeConfig>({
    layers: "1layer",
    flavor: "vanilla",
    frosting: "buttercream",
    toppings: [],
    message: "",
    imageUrl: "",
  });

  const [step, setStep] = useState(0);

  const steps = [
    { title: "Layers", description: "Choose your cake layers" },
    { title: "Flavor", description: "Pick your cake flavor" },
    { title: "Frosting", description: "Select frosting type" },
    { title: "Toppings", description: "Add delicious toppings" },
    { title: "Personalize", description: "Add your personal touch" },
  ];

  const toggleTopping = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      toppings: prev.toppings.includes(id)
        ? prev.toppings.filter((t) => t !== id)
        : [...prev.toppings, id],
    }));
  };

  const handleAddToCart = () => {
    const price = calculateCakePrice(config);
    addItem({
      id: `custom-cake-${Date.now()}`,
      name: "Custom Cake",
      price,
      quantity: 1,
      image: "🎂",
      isCustomCake: true,
      customText: config.message || undefined,
      customImage: config.imageUrl || undefined,
      variantSelections: {
        LAYERS: { variantId: config.layers, name: config.layers, priceModifier: 0 },
        FLAVOR: { variantId: config.flavor, name: config.flavor, priceModifier: 0 },
        FROSTING: { variantId: config.frosting, name: config.frosting, priceModifier: 0 },
      },
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bakery-cream">
      <Header user={session?.user} />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Cake className="h-4 w-4" />
              Custom Cake Builder
            </div>
            <h1 className="text-4xl font-bold text-bakery-chocolate">
              Design Your Dream Cake
            </h1>
            <p className="text-gray-600 mt-2">
              Build your perfect cake step by step
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === i
                    ? "bg-primary-600 text-white"
                    : i < step
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {i < step ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Builder Steps */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {steps[step].title}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {steps[step].description}
                </p>

                {step === 0 && (
                  <LayerSelector
                    selected={config.layers}
                    onSelect={(id) => setConfig({ ...config, layers: id })}
                  />
                )}
                {step === 1 && (
                  <FlavorSelector
                    selected={config.flavor}
                    onSelect={(id) => setConfig({ ...config, flavor: id })}
                  />
                )}
                {step === 2 && (
                  <FrostingSelector
                    selected={config.frosting}
                    onSelect={(id) => setConfig({ ...config, frosting: id })}
                  />
                )}
                {step === 3 && (
                  <ToppingSelector
                    selected={config.toppings}
                    onToggle={toggleTopping}
                  />
                )}
                {step === 4 && (
                  <div className="space-y-6">
                    <MessageInput
                      message={config.message}
                      onChange={(msg) => setConfig({ ...config, message: msg })}
                    />
                    <ImageUploader
                      imageUrl={config.imageUrl}
                      onChange={(url) => setConfig({ ...config, imageUrl: url })}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="btn-primary flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview & Price Sidebar */}
            <div className="space-y-6">
              {/* Live Preview */}
              <div className="card">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Live Preview</h3>
                <CakePreview
                  layers={config.layers}
                  flavor={config.flavor}
                  frosting={config.frosting}
                  toppings={config.toppings}
                  message={config.message}
                />
              </div>

              {/* Price Breakdown */}
              <div className="card">
                <PriceCalculator config={config} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

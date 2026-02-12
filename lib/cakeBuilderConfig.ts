export const CAKE_LAYERS = [
  { id: "1layer", name: "Single Layer", price: 0, height: 60 },
  { id: "2layer", name: "Double Layer", price: 200, height: 100 },
  { id: "3layer", name: "Triple Layer", price: 450, height: 140 },
];

export const CAKE_FLAVORS = [
  { id: "vanilla", name: "Vanilla", color: "#FFF8DC", price: 0 },
  { id: "chocolate", name: "Chocolate", color: "#5C3317", price: 0 },
  { id: "strawberry", name: "Strawberry", color: "#FFB6C1", price: 50 },
  { id: "red-velvet", name: "Red Velvet", color: "#C41E3A", price: 100 },
  { id: "butterscotch", name: "Butterscotch", color: "#E09540", price: 50 },
  { id: "black-forest", name: "Black Forest", color: "#3B2F2F", price: 100 },
];

export const CAKE_FROSTINGS = [
  { id: "buttercream", name: "Buttercream", color: "#FFFDD0", price: 0 },
  { id: "cream-cheese", name: "Cream Cheese", color: "#FFF5EE", price: 50 },
  { id: "chocolate-ganache", name: "Chocolate Ganache", color: "#3B2212", price: 100 },
  { id: "fondant", name: "Fondant", color: "#FFFFFF", price: 150 },
  { id: "whipped-cream", name: "Whipped Cream", color: "#FFFFF0", price: 0 },
];

export const CAKE_TOPPINGS = [
  { id: "sprinkles", name: "Sprinkles", emoji: "✨", price: 30 },
  { id: "fresh-fruit", name: "Fresh Fruit", emoji: "🍓", price: 80 },
  { id: "chocolate-shavings", name: "Chocolate Shavings", emoji: "🍫", price: 50 },
  { id: "nuts", name: "Nuts", emoji: "🥜", price: 60 },
  { id: "flowers", name: "Edible Flowers", emoji: "🌸", price: 120 },
  { id: "macarons", name: "Macarons", emoji: "🧁", price: 150 },
  { id: "candles", name: "Candles", emoji: "🕯️", price: 20 },
  { id: "gold-leaf", name: "Gold Leaf", emoji: "✦", price: 200 },
];

export const BASE_PRICE = 499;

export interface CakeConfig {
  layers: string;
  flavor: string;
  frosting: string;
  toppings: string[];
  message: string;
  imageUrl: string;
}

export function calculateCakePrice(config: CakeConfig): number {
  let price = BASE_PRICE;

  const layer = CAKE_LAYERS.find((l) => l.id === config.layers);
  if (layer) price += layer.price;

  const flavor = CAKE_FLAVORS.find((f) => f.id === config.flavor);
  if (flavor) price += flavor.price;

  const frosting = CAKE_FROSTINGS.find((f) => f.id === config.frosting);
  if (frosting) price += frosting.price;

  config.toppings.forEach((toppingId) => {
    const topping = CAKE_TOPPINGS.find((t) => t.id === toppingId);
    if (topping) price += topping.price;
  });

  return price;
}

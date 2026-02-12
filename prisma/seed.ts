import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.pointsTransaction.deleteMany();
  await prisma.loyaltyAccount.deleteMany();
  await prisma.cakeConfiguration.deleteMany();
  await prisma.adminNotification.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.deliveryPartner.deleteMany();

  console.log("✅ Cleared existing data");

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@mrcake.com",
      password: await bcrypt.hash("admin123", 10),
      phone: "+91 98765 00001",
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("customer123", 10),
      phone: "+91 98765 00002",
      role: "CUSTOMER",
      birthday: "03-15", // March 15th for birthday bonus testing
    },
  });

  const vipCustomer = await prisma.user.create({
    data: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      password: await bcrypt.hash("customer123", 10),
      phone: "+91 98765 00003",
      role: "CUSTOMER",
    },
  });

  console.log("✅ Created users");

  // Create Delivery Partners
  const deliveryPartner1 = await prisma.deliveryPartner.create({
    data: {
      name: "Rajesh Kumar",
      email: "rajesh@mrcake.com",
      password: await bcrypt.hash("delivery123", 10),
      phone: "+91 98765 11111",
      vehicle: "Bike",
      totalDeliveries: 0,
    },
  });

  const deliveryPartner2 = await prisma.deliveryPartner.create({
    data: {
      name: "Amit Sharma",
      email: "amit@mrcake.com",
      password: await bcrypt.hash("delivery123", 10),
      phone: "+91 98765 22222",
      vehicle: "Scooter",
      totalDeliveries: 0,
    },
  });

  console.log("✅ Created delivery partners");

  // Create Categories
  const cakesCategory = await prisma.category.create({
    data: {
      name: "Cakes",
      slug: "cakes",
    },
  });

  const pastriesCategory = await prisma.category.create({
    data: {
      name: "Pastries",
      slug: "pastries",
    },
  });

  const breadsCategory = await prisma.category.create({
    data: {
      name: "Breads",
      slug: "breads",
    },
  });

  const cookiesCategory = await prisma.category.create({
    data: {
      name: "Cookies",
      slug: "cookies",
    },
  });

  console.log("✅ Created categories");

  // Create Products
  const products = [
    // Cakes
    {
      name: "Chocolate Truffle Cake",
      slug: "chocolate-truffle-cake",
      description: "Rich and decadent chocolate cake layered with velvety truffle cream. Perfect for chocolate lovers!",
      price: 850,
      images: JSON.stringify(["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"]),
      categoryId: cakesCategory.id,
      inStock: true,
      featured: true,
      weight: "1 kg",
      servings: "8-10 people",
      ingredients: "Flour, Cocoa, Sugar, Eggs, Butter, Cream, Chocolate",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Red Velvet Cake",
      slug: "red-velvet-cake",
      description: "Classic red velvet cake with cream cheese frosting. A timeless favorite that melts in your mouth.",
      price: 900,
      images: JSON.stringify(["https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80"]),
      categoryId: cakesCategory.id,
      inStock: true,
      featured: true,
      weight: "1 kg",
      servings: "8-10 people",
      ingredients: "Flour, Cocoa, Sugar, Eggs, Buttermilk, Cream Cheese",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Black Forest Cake",
      slug: "black-forest-cake",
      description: "Classic German chocolate cake with cherries and whipped cream. An all-time favorite!",
      price: 950,
      images: JSON.stringify(["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80"]),
      categoryId: cakesCategory.id,
      inStock: true,
      featured: false,
      weight: "1 kg",
      servings: "8-10 people",
      ingredients: "Chocolate Sponge, Cherries, Whipped Cream, Chocolate Shavings",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Vanilla Cream Cake",
      slug: "vanilla-cream-cake",
      description: "Light and fluffy vanilla sponge with smooth vanilla cream filling. Simple yet elegant.",
      price: 700,
      images: JSON.stringify(["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"]),
      categoryId: cakesCategory.id,
      inStock: true,
      featured: false,
      weight: "1 kg",
      servings: "8-10 people",
      ingredients: "Flour, Vanilla, Sugar, Eggs, Butter, Fresh Cream",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Strawberry Delight Cake",
      slug: "strawberry-delight-cake",
      description: "Fresh strawberries layered between soft vanilla sponge and whipped cream. A fruity treat!",
      price: 1000,
      images: JSON.stringify(["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80"]),
      categoryId: cakesCategory.id,
      inStock: true,
      featured: true,
      weight: "1 kg",
      servings: "8-10 people",
      ingredients: "Vanilla Sponge, Fresh Strawberries, Whipped Cream, Strawberry Puree",
      allergens: "Gluten, Dairy, Eggs",
    },

    // Pastries
    {
      name: "Chocolate Éclair",
      slug: "chocolate-eclair",
      description: "French pastry filled with cream and topped with chocolate icing. A bite of heaven!",
      price: 80,
      images: JSON.stringify(["https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80"]),
      categoryId: pastriesCategory.id,
      inStock: true,
      featured: false,
      servings: "1 piece",
      ingredients: "Choux Pastry, Cream, Chocolate",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Fruit Tart",
      slug: "fruit-tart",
      description: "Buttery tart shell filled with custard and topped with fresh seasonal fruits.",
      price: 120,
      images: JSON.stringify(["https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80"]),
      categoryId: pastriesCategory.id,
      inStock: true,
      featured: true,
      servings: "1 piece",
      ingredients: "Tart Shell, Custard, Fresh Fruits, Glaze",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Cheese Danish",
      slug: "cheese-danish",
      description: "Flaky Danish pastry with sweet cream cheese filling. Perfect with morning coffee!",
      price: 90,
      images: JSON.stringify(["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"]),
      categoryId: pastriesCategory.id,
      inStock: true,
      featured: false,
      servings: "1 piece",
      ingredients: "Danish Dough, Cream Cheese, Sugar",
      allergens: "Gluten, Dairy, Eggs",
    },

    // Breads
    {
      name: "Multigrain Bread",
      slug: "multigrain-bread",
      description: "Healthy multigrain bread packed with seeds and grains. Perfect for toast!",
      price: 60,
      images: JSON.stringify(["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"]),
      categoryId: breadsCategory.id,
      inStock: true,
      featured: false,
      weight: "400g",
      ingredients: "Wheat, Oats, Seeds, Yeast, Salt",
      allergens: "Gluten",
    },
    {
      name: "French Baguette",
      slug: "french-baguette",
      description: "Crispy crust with soft interior. Authentic French bread baked fresh daily.",
      price: 70,
      images: JSON.stringify(["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80"]),
      categoryId: breadsCategory.id,
      inStock: true,
      featured: false,
      weight: "300g",
      ingredients: "Flour, Water, Yeast, Salt",
      allergens: "Gluten",
    },
    {
      name: "Garlic Bread",
      slug: "garlic-bread",
      description: "Toasted bread with butter, garlic, and herbs. Great as a side or snack!",
      price: 100,
      images: JSON.stringify(["https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=800&q=80"]),
      categoryId: breadsCategory.id,
      inStock: true,
      featured: false,
      servings: "6 slices",
      ingredients: "Bread, Butter, Garlic, Herbs",
      allergens: "Gluten, Dairy",
    },

    // Cookies
    {
      name: "Chocolate Chip Cookies",
      slug: "chocolate-chip-cookies",
      description: "Classic homemade cookies loaded with chocolate chips. Chewy and delicious!",
      price: 200,
      images: JSON.stringify(["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"]),
      categoryId: cookiesCategory.id,
      inStock: true,
      featured: false,
      servings: "10 pieces",
      ingredients: "Flour, Butter, Sugar, Chocolate Chips, Eggs",
      allergens: "Gluten, Dairy, Eggs",
    },
    {
      name: "Oatmeal Raisin Cookies",
      slug: "oatmeal-raisin-cookies",
      description: "Healthy oatmeal cookies with plump raisins. Perfect guilt-free snack!",
      price: 180,
      images: JSON.stringify(["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80"]),
      categoryId: cookiesCategory.id,
      inStock: true,
      featured: false,
      servings: "10 pieces",
      ingredients: "Oats, Flour, Raisins, Butter, Sugar",
      allergens: "Gluten, Dairy",
    },
    {
      name: "Double Chocolate Cookies",
      slug: "double-chocolate-cookies",
      description: "Rich chocolate cookies with white and dark chocolate chips. A chocolate explosion!",
      price: 220,
      images: JSON.stringify(["https://images.unsplash.com/photo-1590080874088-eec64895b423?w=800&q=80"]),
      categoryId: cookiesCategory.id,
      inStock: true,
      featured: false,
      servings: "10 pieces",
      ingredients: "Cocoa, Flour, Butter, Chocolate Chips, Eggs",
      allergens: "Gluten, Dairy, Eggs",
    },
  ];

  const createdProducts = [];
  for (const product of products) {
    const p = await prisma.product.create({ data: product });
    createdProducts.push(p);
  }

  console.log("✅ Created products");

  // Create sample address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "John Doe",
      phone: "+91 98765 00002",
      address: "123 MG Road, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034",
    },
  });

  console.log("✅ Created sample address");

  // ========== FEATURE 3: Product Variants ==========
  // Add variants to Chocolate Truffle Cake
  const chocolateCake = createdProducts.find(p => p.slug === "chocolate-truffle-cake");
  if (chocolateCake) {
    await prisma.productVariant.createMany({
      data: [
        { productId: chocolateCake.id, type: "SIZE", name: "500g", priceModifier: -200 },
        { productId: chocolateCake.id, type: "SIZE", name: "1kg", priceModifier: 0 },
        { productId: chocolateCake.id, type: "SIZE", name: "2kg", priceModifier: 800 },
        { productId: chocolateCake.id, type: "FLAVOR", name: "Dark Chocolate", priceModifier: 50 },
        { productId: chocolateCake.id, type: "FLAVOR", name: "Milk Chocolate", priceModifier: 0 },
        { productId: chocolateCake.id, type: "LAYER", name: "Single Layer", priceModifier: 0 },
        { productId: chocolateCake.id, type: "LAYER", name: "Double Layer", priceModifier: 300 },
      ],
    });
  }

  // Add variants to Red Velvet Cake
  const redVelvetCake = createdProducts.find(p => p.slug === "red-velvet-cake");
  if (redVelvetCake) {
    await prisma.productVariant.createMany({
      data: [
        { productId: redVelvetCake.id, type: "SIZE", name: "500g", priceModifier: -250 },
        { productId: redVelvetCake.id, type: "SIZE", name: "1kg", priceModifier: 0 },
        { productId: redVelvetCake.id, type: "SIZE", name: "2kg", priceModifier: 900 },
        { productId: redVelvetCake.id, type: "FLAVOR", name: "Classic", priceModifier: 0 },
        { productId: redVelvetCake.id, type: "FLAVOR", name: "Chocolate Cream Cheese", priceModifier: 100 },
      ],
    });
  }

  console.log("✅ Created product variants");

  // ========== FEATURE 1: Coupons ==========
  const activeCoupon = await prisma.coupon.create({
    data: {
      code: "WELCOME50",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 500,
      maxDiscount: 200,
      usageLimit: 100,
      usedCount: 5,
      validFrom: new Date("2026-01-01"),
      validTo: new Date("2026-12-31"),
      firstTimeOnly: true,
      active: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "FLAT100",
      type: "FIXED",
      value: 100,
      minOrderAmount: 800,
      usageLimit: 50,
      usedCount: 0,
      validFrom: new Date("2026-02-01"),
      validTo: new Date("2026-03-31"),
      firstTimeOnly: false,
      active: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "SAVE20",
      type: "PERCENTAGE",
      value: 20,
      minOrderAmount: 1000,
      maxDiscount: 500,
      usageLimit: 30,
      usedCount: 15,
      validFrom: new Date("2026-02-01"),
      validTo: new Date("2026-02-28"),
      firstTimeOnly: false,
      active: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "EXPIRED10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 300,
      usageLimit: 100,
      usedCount: 80,
      validFrom: new Date("2025-01-01"),
      validTo: new Date("2025-12-31"),
      firstTimeOnly: false,
      active: false,
    },
  });

  console.log("✅ Created coupons");

  // ========== FEATURE 8: Loyalty Program ==========
  // Create loyalty account for customer with SILVER tier
  const loyaltyAccount = await prisma.loyaltyAccount.create({
    data: {
      userId: customer.id,
      points: 750,
      tier: "SILVER",
    },
  });

  await prisma.pointsTransaction.createMany({
    data: [
      {
        userId: customer.id,
        points: 500,
        type: "EARNED",
        description: "Points earned from previous orders",
      },
      {
        userId: customer.id,
        points: 250,
        type: "EARNED",
        description: "Birthday bonus points",
      },
    ],
  });

  // Create loyalty account for VIP customer with GOLD tier
  await prisma.loyaltyAccount.create({
    data: {
      userId: vipCustomer.id,
      points: 2500,
      tier: "GOLD",
    },
  });

  await prisma.pointsTransaction.create({
    data: {
      userId: vipCustomer.id,
      points: 2500,
      type: "EARNED",
      description: "Accumulated from multiple orders",
    },
  });

  console.log("✅ Created loyalty accounts");

  // ========== FEATURE 5: Inventory Management ==========
  // Update some products with low stock
  const lowStockProduct = createdProducts.find(p => p.slug === "chocolate-chip-cookies");
  if (lowStockProduct) {
    await prisma.product.update({
      where: { id: lowStockProduct.id },
      data: { quantity: 3, lowStockAlert: 5 },
    });
  }

  const outOfStockProduct = createdProducts.find(p => p.slug === "oatmeal-raisin-cookies");
  if (outOfStockProduct) {
    await prisma.product.update({
      where: { id: outOfStockProduct.id },
      data: { quantity: 0, lowStockAlert: 5, inStock: false },
    });
  }

  // Set normal stock for other products
  for (const product of createdProducts) {
    if (product.id !== lowStockProduct?.id && product.id !== outOfStockProduct?.id) {
      await prisma.product.update({
        where: { id: product.id },
        data: { quantity: 50, lowStockAlert: 10 },
      });
    }
  }

  // Create admin notifications for low stock
  await prisma.adminNotification.createMany({
    data: [
      {
        type: "LOW_STOCK",
        title: "Low Stock Alert",
        message: `${lowStockProduct?.name || "Product"} is running low (3 items remaining)`,
        productId: lowStockProduct?.id,
        read: false,
      },
      {
        type: "OUT_OF_STOCK",
        title: "Out of Stock",
        message: `${outOfStockProduct?.name || "Product"} is out of stock`,
        productId: outOfStockProduct?.id,
        read: false,
      },
    ],
  });

  console.log("✅ Created inventory data and notifications");

  // ========== FEATURE 2: Order Tracking ==========
  // Create sample orders with different statuses for tracking
  const customerAddress = await prisma.address.findFirst({
    where: { userId: customer.id },
  });

  if (customerAddress && chocolateCake) {
    // Update address with coordinates for tracking
    await prisma.address.update({
      where: { id: customerAddress.id },
      data: {
        customerLat: 12.9352,
        customerLng: 77.6245,
      },
    });

    // Order 1: OUT_FOR_DELIVERY with live tracking
    const order1 = await prisma.order.create({
      data: {
        userId: customer.id,
        addressId: customerAddress.id,
        orderNumber: `ORD${Date.now()}001`,
        total: 850,
        subtotal: 850,
        deliveryFee: 50,
        tax: 42.5,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        deliverySlot: "2:00 PM - 5:00 PM",
        paymentMethod: "COD",
        status: "OUT_FOR_DELIVERY",
        deliveryPartnerId: deliveryPartner1.id,
        agentLat: 12.9279,
        agentLng: 77.6271,
        couponId: activeCoupon.id,
        discountAmount: 85,
        pointsEarned: 85,
        statusHistory: JSON.stringify([
          { status: "PENDING", timestamp: new Date(Date.now() - 3600000).toISOString(), note: "Order placed" },
          { status: "CONFIRMED", timestamp: new Date(Date.now() - 3000000).toISOString(), note: "Payment confirmed" },
          { status: "PREPARING", timestamp: new Date(Date.now() - 2400000).toISOString(), note: "Kitchen started preparing" },
          { status: "ASSIGNED", timestamp: new Date(Date.now() - 1800000).toISOString(), note: "Assigned to delivery partner" },
          { status: "PICKED_UP", timestamp: new Date(Date.now() - 900000).toISOString(), note: "Picked up from bakery" },
          { status: "OUT_FOR_DELIVERY", timestamp: new Date(Date.now() - 300000).toISOString(), note: "On the way to your location" },
        ]),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: chocolateCake.id,
        quantity: 1,
        price: 850,
        variantSelections: JSON.stringify({
          SIZE: { variantId: "1kg", name: "1kg", priceModifier: 0 },
          FLAVOR: { variantId: "dark", name: "Dark Chocolate", priceModifier: 50 },
        }),
      },
    });

    // Order 2: PICKED_UP status
    const order2 = await prisma.order.create({
      data: {
        userId: customer.id,
        addressId: customerAddress.id,
        orderNumber: `ORD${Date.now()}002`,
        total: 1200,
        subtotal: 1200,
        deliveryFee: 50,
        tax: 60,
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        deliverySlot: "10:00 AM - 1:00 PM",
        paymentMethod: "COD",
        status: "PICKED_UP",
        deliveryPartnerId: deliveryPartner2.id,
        agentLat: 12.9141,
        agentLng: 77.6411,
        pointsRedeemed: 100,
        statusHistory: JSON.stringify([
          { status: "PENDING", timestamp: new Date(Date.now() - 7200000).toISOString() },
          { status: "CONFIRMED", timestamp: new Date(Date.now() - 6000000).toISOString() },
          { status: "PREPARING", timestamp: new Date(Date.now() - 4800000).toISOString() },
          { status: "ASSIGNED", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { status: "PICKED_UP", timestamp: new Date(Date.now() - 1800000).toISOString() },
        ]),
      },
    });

    const strawberryCake = createdProducts.find(p => p.slug === "strawberry-delight-cake");
    if (strawberryCake) {
      await prisma.orderItem.create({
        data: {
          orderId: order2.id,
          productId: strawberryCake.id,
          quantity: 1,
          price: 1000,
          customText: "Happy Birthday Sarah!",
        },
      });
    }

    // Order 3: DELIVERED status
    await prisma.order.create({
      data: {
        userId: customer.id,
        addressId: customerAddress.id,
        orderNumber: `ORD${Date.now() - 86400000}003`,
        total: 700,
        subtotal: 700,
        deliveryFee: 50,
        tax: 35,
        deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deliverySlot: "6:00 PM - 9:00 PM",
        paymentMethod: "COD",
        status: "DELIVERED",
        deliveryPartnerId: deliveryPartner1.id,
        pointsEarned: 70,
        statusHistory: JSON.stringify([
          { status: "PENDING", timestamp: new Date(Date.now() - 100800000).toISOString() },
          { status: "CONFIRMED", timestamp: new Date(Date.now() - 97200000).toISOString() },
          { status: "PREPARING", timestamp: new Date(Date.now() - 93600000).toISOString() },
          { status: "ASSIGNED", timestamp: new Date(Date.now() - 90000000).toISOString() },
          { status: "PICKED_UP", timestamp: new Date(Date.now() - 86700000).toISOString() },
          { status: "OUT_FOR_DELIVERY", timestamp: new Date(Date.now() - 86500000).toISOString() },
          { status: "DELIVERED", timestamp: new Date(Date.now() - 86400000).toISOString(), note: "Successfully delivered" },
        ]),
      },
    });
  }

  console.log("✅ Created sample orders for tracking");

  // ========== FEATURE 7: Cake Builder ==========
  // Create a saved custom cake configuration
  await prisma.cakeConfiguration.create({
    data: {
      userId: customer.id,
      name: "My Dream Birthday Cake",
      config: JSON.stringify({
        layers: "3",
        flavor: "chocolate",
        frosting: "buttercream",
        toppings: ["sprinkles", "cherries"],
        message: "Happy 30th Birthday!",
      }),
      previewUrl: "/api/placeholder/cake-preview.png",
    },
  });

  console.log("✅ Created cake configuration");

  console.log("\n🎉 Database seeded successfully with test data!");
  console.log("\n📝 Test Credentials:");
  console.log("Admin: admin@mrcake.com / admin123");
  console.log("Customer: john@example.com / customer123 (750 points, SILVER tier)");
  console.log("VIP Customer: sarah@example.com / customer123 (2500 points, GOLD tier)");
  console.log("Delivery: rajesh@mrcake.com / delivery123");
  console.log("\n🎯 Test Features:");
  console.log("✓ F1 Coupons: WELCOME50, FLAT100, SAVE20");
  console.log("✓ F2 Tracking: 3 orders with different statuses");
  console.log("✓ F3 Variants: Chocolate Truffle & Red Velvet have size/flavor options");
  console.log("✓ F5 Inventory: Chocolate Chip (low stock), Oatmeal (out of stock)");
  console.log("✓ F6 Analytics: Orders and revenue data available");
  console.log("✓ F7 Cake Builder: Visit /cake-builder to create custom cakes");
  console.log("✓ F8 Loyalty: John has 750 points, Sarah has 2500 points");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
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
      images: JSON.stringify(["🎂", "🍫"]),
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
      images: JSON.stringify(["🎂", "❤️"]),
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
      images: JSON.stringify(["🎂", "🍒"]),
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
      images: JSON.stringify(["🎂", "🍰"]),
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
      images: JSON.stringify(["🎂", "🍓"]),
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
      images: JSON.stringify(["🥐", "🍫"]),
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
      images: JSON.stringify(["🥧", "🍓"]),
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
      images: JSON.stringify(["🥐", "🧀"]),
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
      images: JSON.stringify(["🍞", "🌾"]),
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
      images: JSON.stringify(["🥖"]),
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
      images: JSON.stringify(["🍞", "🧄"]),
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
      images: JSON.stringify(["🍪", "🍫"]),
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
      images: JSON.stringify(["🍪", "🍇"]),
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
      images: JSON.stringify(["🍪", "🍫"]),
      categoryId: cookiesCategory.id,
      inStock: true,
      featured: false,
      servings: "10 pieces",
      ingredients: "Cocoa, Flour, Butter, Chocolate Chips, Eggs",
      allergens: "Gluten, Dairy, Eggs",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
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

  console.log("🎉 Database seeded successfully!");
  console.log("\n📝 Test Credentials:");
  console.log("Admin: admin@mrcake.com / admin123");
  console.log("Customer: john@example.com / customer123");
  console.log("Delivery: rajesh@mrcake.com / delivery123");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

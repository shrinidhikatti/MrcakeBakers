import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkLoyalty() {
  console.log("🔍 Checking loyalty data...\n");

  const john = await prisma.user.findUnique({
    where: { email: "john@example.com" },
    include: {
      loyaltyAccount: true,
      pointsTransactions: true,
    },
  });

  if (!john) {
    console.log("❌ User john@example.com not found!");
    return;
  }

  console.log("✅ User found:", john.name);
  console.log("📧 Email:", john.email);
  console.log("\n📊 Loyalty Account:");

  if (john.loyaltyAccount) {
    console.log("  Points:", john.loyaltyAccount.points);
    console.log("  Tier:", john.loyaltyAccount.tier);
    console.log("\n💰 Points Transactions:", john.pointsTransactions.length);
    john.pointsTransactions.forEach((tx, i) => {
      console.log(`  ${i + 1}. ${tx.type}: ${tx.points} pts - ${tx.description}`);
    });
  } else {
    console.log("  ❌ No loyalty account found!");
  }
}

checkLoyalty()
  .catch((e) => {
    console.error("Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

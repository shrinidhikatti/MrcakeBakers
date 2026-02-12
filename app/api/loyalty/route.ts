import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let account = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
    });

    // Auto-create if doesn't exist
    if (!account) {
      account = await prisma.loyaltyAccount.create({
        data: {
          userId: session.user.id,
          points: 0,
          tier: "BRONZE",
        },
      });
    }

    const transactions = await prisma.pointsTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Count total orders
    const totalOrders = await prisma.order.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      account,
      transactions,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching loyalty:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty data" }, { status: 500 });
  }
}

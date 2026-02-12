import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalAccounts = await prisma.loyaltyAccount.count();

    const tierCounts = await prisma.loyaltyAccount.groupBy({
      by: ["tier"],
      _count: true,
    });

    const totalPointsIssued = await prisma.pointsTransaction.aggregate({
      where: { type: "EARNED" },
      _sum: { points: true },
    });

    const totalPointsRedeemed = await prisma.pointsTransaction.aggregate({
      where: { type: "REDEEMED" },
      _sum: { points: true },
    });

    const recentTransactions = await prisma.pointsTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      totalAccounts,
      tierCounts: tierCounts.map((t) => ({ tier: t.tier, count: t._count })),
      totalPointsIssued: totalPointsIssued._sum.points || 0,
      totalPointsRedeemed: Math.abs(totalPointsRedeemed._sum.points || 0),
      recentTransactions,
    });
  } catch (error) {
    console.error("Error fetching loyalty stats:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty stats" }, { status: 500 });
  }
}

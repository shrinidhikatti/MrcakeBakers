import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MIN_REDEEM_POINTS } from "@/lib/loyalty";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points } = await request.json();

    if (!points || points < MIN_REDEEM_POINTS) {
      return NextResponse.json(
        { error: `Minimum ${MIN_REDEEM_POINTS} points required to redeem` },
        { status: 400 }
      );
    }

    const account = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!account || account.points < points) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 400 });
    }

    // Return the discount value (1 point = ₹1)
    return NextResponse.json({
      points,
      discount: points,
      message: `₹${points} discount will be applied`,
    });
  } catch (error) {
    console.error("Error redeeming points:", error);
    return NextResponse.json({ error: "Failed to redeem points" }, { status: 500 });
  }
}

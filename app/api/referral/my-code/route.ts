import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true },
    });

    const referralCount = await prisma.user.count({
      where: { referredBy: session.user.id },
    });

    return NextResponse.json({
      referralCode: user?.referralCode ?? null,
      referralCount,
    });
  } catch (error) {
    console.error("Error fetching referral code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, subtotal } = await request.json();

    if (!code || !subtotal) {
      return NextResponse.json({ error: "Missing code or subtotal" }, { status: 400 });
    }

    // Find referrer by code
    const referrer = await prisma.user.findUnique({
      where: { referralCode: code.toUpperCase() },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    // Can't use own referral code
    if (referrer.id === session.user.id) {
      return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 });
    }

    // Check if this is the user's first order
    const orderCount = await prisma.order.count({
      where: { userId: session.user.id },
    });

    if (orderCount > 0) {
      return NextResponse.json({ error: "Referral discount is only for your first order" }, { status: 400 });
    }

    // 10% discount
    const discount = Math.min(Math.round(subtotal * 0.1), subtotal);

    return NextResponse.json({
      valid: true,
      discount,
      referrerId: referrer.id,
      referrerName: referrer.name,
    });
  } catch (error) {
    console.error("Error validating referral:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

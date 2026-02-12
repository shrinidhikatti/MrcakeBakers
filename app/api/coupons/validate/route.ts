import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (!coupon.active) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    // Check validity dates
    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({ error: "This coupon is not yet valid" }, { status: 400 });
    }
    if (coupon.validTo && now > coupon.validTo) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    // Check minimum order amount
    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount is ₹${coupon.minOrderAmount}` },
        { status: 400 }
      );
    }

    // Check first-time only
    if (coupon.firstTimeOnly) {
      const previousOrders = await prisma.order.count({
        where: { userId: session.user.id },
      });
      if (previousOrders > 0) {
        return NextResponse.json(
          { error: "This coupon is for first-time orders only" },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    // Don't let discount exceed subtotal
    discount = Math.min(discount, subtotal);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      message:
        coupon.type === "PERCENTAGE"
          ? `${coupon.value}% off applied!`
          : `₹${coupon.value} off applied!`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}

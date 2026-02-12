import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { decrementStock } from "@/lib/inventory";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      deliveryDate,
      deliverySlot,
      specialInstructions,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      customerLat,
      customerLng,
      couponCode,
      discountAmount,
      pointsToRedeem,
    } = body;

    // Validate required fields
    if (!fullName || !phone || !address || !city || !pincode || !deliveryDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create address with optional GPS coordinates
    const addressRecord = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        phone,
        address,
        city,
        state: state || "Karnataka",
        pincode,
        customerLat: customerLat != null ? parseFloat(customerLat) : null,
        customerLng: customerLng != null ? parseFloat(customerLng) : null,
      },
    });

    // Handle coupon validation
    let couponId: string | null = null;
    let finalDiscount = discountAmount || 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.active) {
        couponId = coupon.id;
        // Increment usage count
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    // Handle points redemption
    let redeemedPoints = 0;
    if (pointsToRedeem && pointsToRedeem > 0) {
      const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
        where: { userId: session.user.id },
      });
      if (loyaltyAccount && loyaltyAccount.points >= pointsToRedeem) {
        redeemedPoints = pointsToRedeem;
        await prisma.loyaltyAccount.update({
          where: { userId: session.user.id },
          data: { points: { decrement: redeemedPoints } },
        });
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        addressId: addressRecord.id,
        subtotal,
        deliveryFee,
        tax,
        total,
        status: "PENDING",
        deliveryDate: new Date(deliveryDate),
        deliverySlot,
        specialInstructions,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        couponId,
        discountAmount: finalDiscount,
        pointsRedeemed: redeemedPoints,
        statusHistory: JSON.stringify([
          {
            status: "PENDING",
            timestamp: new Date().toISOString(),
            note: "Order placed",
          },
        ]),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantSelections: item.variantSelections ? JSON.stringify(item.variantSelections) : null,
            customText: item.customText || null,
            customImage: item.customImage || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    // Decrement stock
    await decrementStock(
      items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    // Award loyalty points (1 point per ₹10 spent)
    const pointsEarned = Math.floor(total / 10);
    if (pointsEarned > 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: { pointsEarned },
      });

      // Upsert loyalty account
      const existingAccount = await prisma.loyaltyAccount.findUnique({
        where: { userId: session.user.id },
      });

      if (existingAccount) {
        const newPoints = existingAccount.points + pointsEarned;
        const newTier =
          newPoints >= 5000 ? "PLATINUM" :
          newPoints >= 2000 ? "GOLD" :
          newPoints >= 500 ? "SILVER" : "BRONZE";

        await prisma.loyaltyAccount.update({
          where: { userId: session.user.id },
          data: { points: { increment: pointsEarned }, tier: newTier },
        });
      } else {
        await prisma.loyaltyAccount.create({
          data: {
            userId: session.user.id,
            points: pointsEarned,
            tier: "BRONZE",
          },
        });
      }

      // Record points transaction
      await prisma.pointsTransaction.create({
        data: {
          userId: session.user.id,
          points: pointsEarned,
          type: "EARNED",
          orderId: order.id,
          description: `Earned from order ${orderNumber}`,
        },
      });

      // Record redemption transaction if applicable
      if (redeemedPoints > 0) {
        await prisma.pointsTransaction.create({
          data: {
            userId: session.user.id,
            points: -redeemedPoints,
            type: "REDEEMED",
            orderId: order.id,
            description: `Redeemed on order ${orderNumber}`,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        pointsEarned,
        message: "Order placed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

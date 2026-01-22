import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

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
    } = body;

    // Validate required fields
    if (!fullName || !phone || !address || !city || !pincode || !deliveryDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create address
    const addressRecord = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        phone,
        address,
        city,
        state: state || "Karnataka",
        pincode,
      },
    });

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

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
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

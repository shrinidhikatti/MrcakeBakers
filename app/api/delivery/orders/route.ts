import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "DELIVERY_PARTNER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const deliveryPartner = await prisma.deliveryPartner.findUnique({
      where: { email: session.user.email! },
    });

    if (!deliveryPartner) {
      return NextResponse.json(
        { error: "Delivery partner not found" },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        deliveryPartnerId: deliveryPartner.id,
        status: {
          in: ["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders,
      stats: {
        total: deliveryPartner.totalDeliveries,
        active: orders.length,
      },
    });
  } catch (error) {
    console.error("Error fetching delivery orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

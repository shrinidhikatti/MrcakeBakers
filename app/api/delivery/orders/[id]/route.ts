import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "DELIVERY_PARTNER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { deliveryPartner: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Update delivery count if delivered
    if (status === "DELIVERED" && order.deliveryPartnerId) {
      await prisma.deliveryPartner.update({
        where: { id: order.deliveryPartnerId },
        data: {
          totalDeliveries: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Delivery agent updates their current GPS location for an order
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "DELIVERY_PARTNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, lat, lng } = await request.json();

    if (!orderId || lat == null || lng == null) {
      return NextResponse.json({ error: "Missing orderId, lat, or lng" }, { status: 400 });
    }

    // Verify order belongs to this delivery partner
    const order = await prisma.order.findUnique({
      where: { id: orderId, deliveryPartnerId: session.user.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or not assigned to you" }, { status: 404 });
    }

    // Update agent location on the order
    await prisma.order.update({
      where: { id: orderId },
      data: { agentLat: parseFloat(lat), agentLng: parseFloat(lng) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating agent location:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

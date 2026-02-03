import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Customer polls this endpoint to get agent's current location + customer's saved location
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.user.id },
      include: { address: true, deliveryPartner: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: order.status,
      agentLocation: order.agentLat != null && order.agentLng != null
        ? { lat: order.agentLat, lng: order.agentLng }
        : null,
      customerLocation: order.address.customerLat != null && order.address.customerLng != null
        ? { lat: order.address.customerLat, lng: order.address.customerLng }
        : null,
      agentName: order.deliveryPartner?.name || null,
    });
  } catch (error) {
    console.error("Error fetching tracking:", error);
    return NextResponse.json({ error: "Failed to fetch tracking" }, { status: 500 });
  }
}

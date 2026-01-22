import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get statistics
    const [
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: "CANCELLED",
          },
        },
      }),
      // Total orders
      prisma.order.count(),
      // Pending orders
      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),
      // Total products
      prisma.product.count(),
      // Total users
      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          address: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

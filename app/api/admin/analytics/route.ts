import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get orders for the period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate revenue by day
    const revenueByDay: { [key: string]: number } = {};
    const ordersByDay: { [key: string]: number } = {};
    const ordersByStatus: { [key: string]: number } = {};

    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      revenueByDay[dateKey] = (revenueByDay[dateKey] || 0) + order.total;
      ordersByDay[dateKey] = (ordersByDay[dateKey] || 0) + 1;
      ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
    });

    // Format data for charts
    const revenueData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({
        date,
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const ordersData = Object.entries(ordersByDay)
      .map(([date, count]) => ({
        date,
        orders: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top selling products
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: '',
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    // Get product names
    const productIds = Object.keys(productSales);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    products.forEach((product) => {
      if (productSales[product.id]) {
        productSales[product.id].name = product.name;
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        quantity: data.quantity,
        revenue: parseFloat(data.revenue.toFixed(2)),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Get total stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get customer stats
    const uniqueCustomers = new Set(orders.map((order) => order.userId)).size;

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        OR: [
          {
            quantity: {
              lte: prisma.product.fields.lowStockAlert,
            },
          },
          {
            quantity: 0,
          },
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        quantity: 'asc',
      },
      take: 10,
    });

    return NextResponse.json({
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        uniqueCustomers,
      },
      revenueData,
      ordersData,
      ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({
        status,
        count,
      })),
      topProducts,
      lowStockProducts,
      recentOrders: orders.slice(0, 10).map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user.name,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    // If requesting delivery partners, fetch from DeliveryPartner table
    if (role === 'DELIVERY_PARTNER') {
      const deliveryPartners = await prisma.deliveryPartner.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          vehicle: true,
          totalDeliveries: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform to match User interface expected by frontend
      const transformedPartners = deliveryPartners.map((partner) => ({
        id: partner.id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        role: 'DELIVERY_PARTNER' as const,
        createdAt: partner.createdAt,
        vehicle: partner.vehicle,
        totalDeliveries: partner.totalDeliveries,
        _count: {
          orders: partner._count.orders,
          wishlist: 0,
        },
      }));

      return NextResponse.json(transformedPartners);
    }

    const where: any = {};
    if (role && role !== 'all') {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            wishlist: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

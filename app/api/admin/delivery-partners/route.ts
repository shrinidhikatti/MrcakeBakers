import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Create new delivery partner
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, phone, vehicle } = body;

    // Validate required fields
    if (!name || !email || !password || !phone || !vehicle) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingPartner = await prisma.deliveryPartner.findUnique({
      where: { email },
    });

    if (existingPartner) {
      return NextResponse.json(
        { error: 'A delivery partner with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create delivery partner
    const deliveryPartner = await prisma.deliveryPartner.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        vehicle,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        vehicle: true,
        createdAt: true,
      },
    });

    return NextResponse.json(deliveryPartner, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery partner:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery partner' },
      { status: 500 }
    );
  }
}

// GET - Fetch all delivery partners
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json(deliveryPartners);
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery partners' },
      { status: 500 }
    );
  }
}

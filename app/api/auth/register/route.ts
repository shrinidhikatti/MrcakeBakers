import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "CAKE-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, birthday, specialDays, referralCode: usedReferralCode } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Resolve referrer
    let referrerId: string | null = null;
    if (usedReferralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: usedReferralCode.toUpperCase() },
      });
      if (referrer) referrerId = referrer.id;
    }

    // Generate unique referral code
    let newReferralCode = generateReferralCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
      if (!existing) break;
      newReferralCode = generateReferralCode();
      attempts++;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        birthday: birthday ? birthday.slice(5) : null, // extract MM-DD from YYYY-MM-DD
        role: "CUSTOMER",
        referralCode: newReferralCode,
        referredBy: referrerId,
      },
    });

    // Create special days (loved ones) added at signup
    if (Array.isArray(specialDays) && specialDays.length > 0) {
      await prisma.specialDay.createMany({
        data: specialDays
          .filter((sd: any) => sd.name && sd.date)
          .map((sd: any) => ({
            userId: user.id,
            name: sd.name,
            date: sd.date.slice(5), // YYYY-MM-DD → MM-DD
            type: sd.type || "BIRTHDAY",
            relationship: sd.relationship || "Other",
          })),
      });
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

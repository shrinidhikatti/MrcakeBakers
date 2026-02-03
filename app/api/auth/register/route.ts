import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, birthday, specialDays } = await request.json();

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        birthday: birthday ? birthday.slice(5) : null, // extract MM-DD from YYYY-MM-DD
        role: "CUSTOMER",
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

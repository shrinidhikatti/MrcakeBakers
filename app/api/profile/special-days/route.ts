import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const specialDays = await prisma.specialDay.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(specialDays);
  } catch (error) {
    console.error("Error fetching special days:", error);
    return NextResponse.json({ error: "Failed to fetch special days" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, date, type, relationship } = await request.json();

    if (!name || !date) {
      return NextResponse.json({ error: "Name and date are required" }, { status: 400 });
    }

    const specialDay = await prisma.specialDay.create({
      data: {
        userId: session.user.id,
        name,
        date,
        type: type || "BIRTHDAY",
        relationship: relationship || "Other",
      },
    });

    return NextResponse.json(specialDay, { status: 201 });
  } catch (error) {
    console.error("Error creating special day:", error);
    return NextResponse.json({ error: "Failed to create special day" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "main" },
    });

    return NextResponse.json({
      activeHeroId: settings?.activeHeroId || "variant1",
    });
  } catch (error) {
    console.error("Error fetching hero settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { heroId } = await request.json();

    // Validate heroId
    const validHeroIds = ["variant1", "variant2", "variant3", "variant4"];
    if (!validHeroIds.includes(heroId)) {
      return NextResponse.json({ error: "Invalid hero ID" }, { status: 400 });
    }

    // Update or create settings
    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: { activeHeroId: heroId },
      create: { id: "main", activeHeroId: heroId },
    });

    // Revalidate the home page to show new hero
    // Note: In production, you'd want to use revalidatePath or revalidateTag

    return NextResponse.json({
      success: true,
      activeHeroId: settings.activeHeroId,
    });
  } catch (error) {
    console.error("Error updating hero settings:", error);
    return NextResponse.json(
      { error: "Failed to update hero settings" },
      { status: 500 }
    );
  }
}

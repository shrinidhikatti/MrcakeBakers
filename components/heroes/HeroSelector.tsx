import { prisma } from "@/lib/prisma";
import HeroVariant1 from "./HeroVariant1";
import HeroVariant2 from "./HeroVariant2";

// Map hero IDs to their components
const HERO_VARIANTS = {
  variant1: HeroVariant1,
  variant2: HeroVariant2,
  // variant3 and variant4 can be added later
};

export default async function HeroSelector() {
  // Get the active hero from database settings
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "main" },
  });

  // If no settings exist, create default
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: "main",
        activeHeroId: "variant1",
      },
    });
  }

  const activeHeroId = settings.activeHeroId;

  // Get the component for the active hero (default to variant1)
  const HeroComponent = HERO_VARIANTS[activeHeroId as keyof typeof HERO_VARIANTS] || HeroVariant1;

  return <HeroComponent />;
}

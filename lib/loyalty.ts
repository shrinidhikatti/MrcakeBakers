export const TIER_CONFIG = {
  BRONZE: { name: "Bronze", minPoints: 0, color: "#CD7F32", multiplier: 1 },
  SILVER: { name: "Silver", minPoints: 500, color: "#C0C0C0", multiplier: 1.25 },
  GOLD: { name: "Gold", minPoints: 2000, color: "#FFD700", multiplier: 1.5 },
  PLATINUM: { name: "Platinum", minPoints: 5000, color: "#E5E4E2", multiplier: 2 },
};

export function getTierInfo(tier: string) {
  return TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.BRONZE;
}

export function getNextTier(tier: string) {
  const tiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const currentIndex = tiers.indexOf(tier);
  if (currentIndex >= tiers.length - 1) return null;
  return tiers[currentIndex + 1] as keyof typeof TIER_CONFIG;
}

export function pointsToNextTier(currentPoints: number, currentTier: string): number | null {
  const next = getNextTier(currentTier);
  if (!next) return null;
  return TIER_CONFIG[next].minPoints - currentPoints;
}

// 1 point = ₹1 discount, min 100 points to redeem
export function calculatePointsDiscount(points: number): number {
  return points;
}

export const MIN_REDEEM_POINTS = 100;
export const POINTS_PER_RUPEE = 10; // Earn 1 point per ₹10
export const BIRTHDAY_BONUS = 200;

"use client";

import { getTierInfo } from "@/lib/loyalty";
import { Award } from "lucide-react";

interface LoyaltyTierBadgeProps {
  tier: string;
  size?: "sm" | "md" | "lg";
}

export default function LoyaltyTierBadge({ tier, size = "sm" }: LoyaltyTierBadgeProps) {
  const info = getTierInfo(tier);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${info.color}20`,
        color: info.color === "#E5E4E2" ? "#666" : info.color,
        border: `1px solid ${info.color}40`,
      }}
    >
      <Award className={iconSizes[size]} />
      {info.name}
    </span>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Award, Minus, Plus } from "lucide-react";
import { MIN_REDEEM_POINTS } from "@/lib/loyalty";
import { formatPrice } from "@/lib/utils";

interface PointsRedemptionProps {
  orderTotal: number;
  onRedeem: (points: number, discount: number) => void;
}

export default function PointsRedemption({ orderTotal, onRedeem }: PointsRedemptionProps) {
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [tier, setTier] = useState("BRONZE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const res = await fetch("/api/loyalty");
        if (res.ok) {
          const data = await res.json();
          setAvailablePoints(data.account?.points || 0);
          setTier(data.account?.tier || "BRONZE");
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  if (loading || availablePoints < MIN_REDEEM_POINTS) return null;

  // Max redeemable: can't exceed order total or available points
  const maxRedeem = Math.min(availablePoints, Math.floor(orderTotal));

  const handleChange = (newPoints: number) => {
    const clamped = Math.max(0, Math.min(maxRedeem, newPoints));
    setPointsToUse(clamped);
    onRedeem(clamped, clamped); // 1 point = ₹1
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-primary-600" />
          Use Loyalty Points
        </span>
        <span className="text-xs text-gray-500">
          {availablePoints} pts available
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleChange(pointsToUse - 50)}
          disabled={pointsToUse <= 0}
          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={maxRedeem}
            step={10}
            value={pointsToUse}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full accent-primary-600"
          />
        </div>
        <button
          onClick={() => handleChange(pointsToUse + 50)}
          disabled={pointsToUse >= maxRedeem}
          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {pointsToUse > 0 && (
        <p className="text-sm text-green-600 font-medium">
          Using {pointsToUse} points = {formatPrice(pointsToUse)} discount
        </p>
      )}
    </div>
  );
}

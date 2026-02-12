"use client";

import { useEffect, useState } from "react";
import { Award, TrendingUp, Gift, Clock } from "lucide-react";
import LoyaltyTierBadge from "@/components/LoyaltyTierBadge";
import { getTierInfo, getNextTier, TIER_CONFIG } from "@/lib/loyalty";

interface LoyaltyData {
  account: { points: number; tier: string };
  transactions: {
    id: string;
    points: number;
    type: string;
    description: string;
    createdAt: string;
  }[];
  totalOrders: number;
}

export default function LoyaltyDashboard() {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/loyalty");
        if (res.ok) {
          setData(await res.json());
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) return null;

  const { account, transactions, totalOrders } = data;
  const tierInfo = getTierInfo(account.tier);
  const nextTier = getNextTier(account.tier);
  const nextTierInfo = nextTier ? TIER_CONFIG[nextTier] : null;
  const progressToNext = nextTierInfo
    ? Math.min(100, (account.points / nextTierInfo.minPoints) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Tier Card */}
      <div
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tierInfo.color}, ${tierInfo.color}dd)`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 -ml-8 -mb-8" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <LoyaltyTierBadge tier={account.tier} size="lg" />
            <span className="text-sm opacity-80">{tierInfo.multiplier}x points</span>
          </div>

          <div className="mb-4">
            <p className="text-4xl font-bold">{account.points.toLocaleString()}</p>
            <p className="text-sm opacity-80">Total Points</p>
          </div>

          {nextTierInfo && (
            <div>
              <div className="flex justify-between text-xs opacity-80 mb-1">
                <span>{account.tier}</span>
                <span>{nextTier}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="text-xs mt-1 opacity-80">
                {(nextTierInfo.minPoints - account.points).toLocaleString()} points to{" "}
                {nextTier}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Award className="h-6 w-6 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{account.points}</p>
          <p className="text-xs text-gray-500">Points Balance</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
          <p className="text-xs text-gray-500">Total Orders</p>
        </div>
        <div className="card text-center">
          <Gift className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{tierInfo.multiplier}x</p>
          <p className="text-xs text-gray-500">Points Multiplier</p>
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-3">How It Works</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Earn <strong>1 point for every ₹10</strong> spent on orders</p>
          <p>Redeem <strong>1 point = ₹1</strong> discount (minimum 100 points)</p>
          <p>Higher tiers earn points faster with multiplier bonuses</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-4">Points History</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No transactions yet. Place an order to start earning points!
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      tx.type === "EARNED"
                        ? "bg-green-100 text-green-600"
                        : tx.type === "BIRTHDAY_BONUS"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.type === "EARNED" ? "+" : tx.type === "BIRTHDAY_BONUS" ? "🎂" : "-"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.points > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.points > 0 ? "+" : ""}
                  {tx.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

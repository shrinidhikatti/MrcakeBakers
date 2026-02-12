"use client";

import { useEffect, useState } from "react";
import { Award, Users, TrendingUp, Gift } from "lucide-react";

interface LoyaltyStats {
  totalAccounts: number;
  tierCounts: { tier: string; count: number }[];
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  recentTransactions: {
    id: string;
    points: number;
    type: string;
    description: string;
    createdAt: string;
    user: { name: string; email: string };
  }[];
}

const TIER_COLORS: Record<string, string> = {
  BRONZE: "#CD7F32",
  SILVER: "#C0C0C0",
  GOLD: "#FFD700",
  PLATINUM: "#E5E4E2",
};

export default function AdminLoyaltyPage() {
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/loyalty");
        if (res.ok) {
          setStats(await res.json());
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-32 text-center text-gray-500">Failed to load loyalty data.</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Loyalty Program</h1>
        <p className="text-slate-600 mt-1">Overview of customer loyalty and rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Users className="h-8 w-8 text-blue-500 mb-3" />
          <p className="text-sm text-gray-600">Total Members</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalAccounts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
          <p className="text-sm text-gray-600">Points Issued</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalPointsIssued.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Gift className="h-8 w-8 text-purple-500 mb-3" />
          <p className="text-sm text-gray-600">Points Redeemed</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalPointsRedeemed.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Award className="h-8 w-8 text-yellow-500 mb-3" />
          <p className="text-sm text-gray-600">Outstanding Points</p>
          <p className="text-2xl font-bold text-slate-900">
            {(stats.totalPointsIssued - stats.totalPointsRedeemed).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Tier Distribution</h2>
          <div className="space-y-3">
            {["BRONZE", "SILVER", "GOLD", "PLATINUM"].map((tier) => {
              const tierData = stats.tierCounts.find((t) => t.tier === tier);
              const count = tierData?.count || 0;
              const percentage =
                stats.totalAccounts > 0
                  ? Math.round((count / stats.totalAccounts) * 100)
                  : 0;

              return (
                <div key={tier} className="flex items-center gap-4">
                  <span
                    className="w-20 text-sm font-medium"
                    style={{ color: TIER_COLORS[tier] }}
                  >
                    {tier}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4">
                    <div
                      className="rounded-full h-4 transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: TIER_COLORS[tier],
                        minWidth: count > 0 ? "20px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-16 text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentTransactions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No activity yet</p>
            ) : (
              stats.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.user.name}</p>
                    <p className="text-xs text-gray-500">{tx.description}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      tx.points > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.points > 0 ? "+" : ""}
                    {tx.points}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

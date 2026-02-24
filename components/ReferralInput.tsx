"use client";

import { useState } from "react";
import { Gift, X, Loader2, Check } from "lucide-react";

interface ReferralInputProps {
  subtotal: number;
  onApply: (code: string, discount: number, referrerId: string) => void;
  onRemove: () => void;
  appliedCode: string | null;
  discount: number;
}

export default function ReferralInput({
  subtotal,
  onApply,
  onRemove,
  appliedCode,
  discount,
}: ReferralInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/referral/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      onApply(code.trim().toUpperCase(), data.discount, data.referrerId);
      setCode("");
    } catch {
      setError("Failed to validate referral code");
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Referral {appliedCode} applied
          </span>
          <span className="text-sm text-green-600">(-₹{discount})</span>
        </div>
        <button
          onClick={onRemove}
          className="text-green-600 hover:text-green-800 p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Gift className="h-4 w-4 text-primary-500" />
        Have a referral code? Get 10% off your first order!
      </p>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Enter referral code (e.g. CAKE-ABC123)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="input pl-10 text-sm"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

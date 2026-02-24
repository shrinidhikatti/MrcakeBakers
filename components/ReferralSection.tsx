"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, Check, Users } from "lucide-react";

export default function ReferralSection() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral/my-code")
      .then((r) => r.json())
      .then((data) => {
        setReferralCode(data.referralCode);
        setReferralCount(data.referralCount ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-bakery-chocolate mb-4 flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary-500" />
        Referral Program
      </h3>

      {loading ? (
        <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
      ) : referralCode ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Share your referral code with friends. They get <strong>10% off</strong> their first order,
            and you earn <strong>100 loyalty points</strong> when they order!
          </p>

          <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-lg px-4 py-3">
            <code className="flex-1 text-lg font-bold text-primary-700 tracking-widest">
              {referralCode}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-primary-500" />
            <span>
              {referralCount === 0
                ? "No referrals yet — start sharing!"
                : `${referralCount} friend${referralCount > 1 ? "s" : ""} referred`}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No referral code available yet.</p>
      )}
    </div>
  );
}

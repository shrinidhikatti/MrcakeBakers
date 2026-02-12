"use client";

import { useEffect, useState } from "react";

export default function TestLoyaltyPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/loyalty")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Loyalty data:", data);
        setData(data);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Loyalty API Test</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!data && !error && <p>Loading...</p>}

      {data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">✅ API Response:</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Account:</h3>
              <p>Points: {data.account.points}</p>
              <p>Tier: {data.account.tier}</p>
            </div>

            <div>
              <h3 className="font-semibold">Total Orders:</h3>
              <p>{data.totalOrders}</p>
            </div>

            <div>
              <h3 className="font-semibold">Transactions ({data.transactions.length}):</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(data.transactions, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <a href="/profile/loyalty" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Go to Real Loyalty Page
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

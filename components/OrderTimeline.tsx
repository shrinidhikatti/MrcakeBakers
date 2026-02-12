"use client";

import { Check, Clock, Package, Truck, ChefHat, MapPin, XCircle } from "lucide-react";

interface StatusEntry {
  status: string;
  timestamp: string;
  note?: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  PENDING: { label: "Order Placed", icon: Clock, color: "text-yellow-500 bg-yellow-100" },
  CONFIRMED: { label: "Confirmed", icon: Check, color: "text-blue-500 bg-blue-100" },
  PREPARING: { label: "Preparing", icon: ChefHat, color: "text-purple-500 bg-purple-100" },
  ASSIGNED: { label: "Driver Assigned", icon: Package, color: "text-indigo-500 bg-indigo-100" },
  PICKED_UP: { label: "Picked Up", icon: Truck, color: "text-cyan-500 bg-cyan-100" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "text-orange-500 bg-orange-100" },
  DELIVERED: { label: "Delivered", icon: MapPin, color: "text-green-500 bg-green-100" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-100" },
};

const STATUS_ORDER = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderTimeline({
  currentStatus,
  statusHistory,
}: {
  currentStatus: string;
  statusHistory: StatusEntry[];
}) {
  const historyMap = new Map<string, StatusEntry>();
  statusHistory.forEach((entry) => historyMap.set(entry.status, entry));

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div className="space-y-0">
      {STATUS_ORDER.map((status, index) => {
        const config = STATUS_CONFIG[status];
        const entry = historyMap.get(status);
        const isCompleted = index <= currentIndex && !isCancelled;
        const isCurrent = status === currentStatus;
        const Icon = config.icon;

        return (
          <div key={status} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? config.color
                    : "text-gray-300 bg-gray-100"
                } ${isCurrent ? "ring-2 ring-offset-2 ring-primary-400" : ""}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {index < STATUS_ORDER.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    index < currentIndex && !isCancelled
                      ? "bg-green-300"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8 pt-1">
              <p
                className={`text-sm font-semibold ${
                  isCompleted ? "text-slate-900" : "text-gray-400"
                }`}
              >
                {config.label}
              </p>
              {entry && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(entry.timestamp).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {entry.note && ` — ${entry.note}`}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {isCancelled && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-500 ring-2 ring-offset-2 ring-red-400">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-red-600">Cancelled</p>
            {historyMap.get("CANCELLED") && (
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(historyMap.get("CANCELLED")!.timestamp).toLocaleString("en-IN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

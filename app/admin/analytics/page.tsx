"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, ShoppingBag, Users, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { downloadCSV } from "@/lib/csvExport";
import RevenueChart from "@/components/charts/RevenueChart";
import OrdersChart from "@/components/charts/OrdersChart";
import StatusPieChart from "@/components/charts/StatusPieChart";
import TopProductsChart from "@/components/charts/TopProductsChart";

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    uniqueCustomers: number;
  };
  revenueData: { date: string; revenue: number }[];
  ordersData: { date: string; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { id: string; name: string; quantity: number; revenue: number }[];
  recentOrders: any[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?days=${period}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const handleExportRevenue = () => {
    if (!data) return;
    downloadCSV(data.revenueData, `revenue-${period}days`);
  };

  const handleExportOrders = () => {
    if (!data) return;
    downloadCSV(
      data.recentOrders.map((o) => ({
        orderNumber: o.orderNumber,
        customer: o.customer,
        total: o.total,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString("en-IN"),
      })),
      `orders-${period}days`
    );
  };

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-32 text-center text-gray-500">Failed to load analytics data.</div>
    );
  }

  const summaryCards = [
    {
      title: "Total Revenue",
      value: formatPrice(data.summary.totalRevenue),
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: data.summary.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Avg Order Value",
      value: formatPrice(data.summary.avgOrderValue),
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Unique Customers",
      value: data.summary.uniqueCustomers,
      icon: Users,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
          <p className="text-slate-600 mt-1">Track your store performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleExportRevenue}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Revenue CSV
            </button>
            <button
              onClick={handleExportOrders}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Orders CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={data.revenueData} />
        <OrdersChart data={data.ordersData} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <StatusPieChart data={data.ordersByStatus} />
        <TopProductsChart data={data.topProducts} />
      </div>
    </div>
  );
}

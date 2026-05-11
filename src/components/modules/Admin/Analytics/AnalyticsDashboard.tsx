/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "@/services/analytics.services";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  Layers,
} from "lucide-react";
import AIAnalyticsInsights from "./AIAnalyticsInsights";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => getAdminAnalytics(),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  // Process Category Distribution
  const categoryData = analytics?.categoryDistribution?.map((cat: any) => ({
    name: cat.name,
    value: cat._count.products,
  })) || [
    { name: "Electronics", value: 400 },
    { name: "Fashion", value: 300 },
    { name: "Home", value: 300 },
    { name: "Books", value: 200 },
  ];

  // Monthly Orders (Dummy processing for demo if needed)
  const monthlyOrders = [
    { name: "Jan", orders: 65 },
    { name: "Feb", orders: 59 },
    { name: "Mar", orders: 80 },
    { name: "Apr", orders: 81 },
    { name: "May", orders: 56 },
    { name: "Jun", orders: 55 },
  ];

  return (
    <div className="space-y-10 p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground font-medium">
            Deep dive into your marketplace performance metrics.
          </p>
        </div>
        <AIAnalyticsInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution - Pie Chart */}
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" /> Category
              Distribution
            </CardTitle>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Orders Volume - Bar Chart */}
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" /> Monthly Order
              Volume
            </CardTitle>
          </CardHeader>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyOrders}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "16px",
                    border: "none",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#3b82f6"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                  animationDuration={2000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Market Share / Top Shops Placeholder */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-8">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Growth
              Insights
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 space-y-2">
              <p className="text-blue-600 font-black text-xs uppercase tracking-widest">
                User Retention
              </p>
              <h4 className="text-4xl font-black text-slate-900">84%</h4>
              <p className="text-slate-500 text-sm font-medium">
                +12% from last month
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-purple-50 border border-purple-100 space-y-2">
              <p className="text-purple-600 font-black text-xs uppercase tracking-widest">
                Avg. Order Value
              </p>
              <h4 className="text-4xl font-black text-slate-900">৳3,450</h4>
              <p className="text-slate-500 text-sm font-medium">
                Steady performance
              </p>
            </div>
            <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 space-y-2">
              <p className="text-emerald-600 font-black text-xs uppercase tracking-widest">
                Vendor Satisfaction
              </p>
              <h4 className="text-4xl font-black text-slate-900">4.9/5</h4>
              <p className="text-slate-500 text-sm font-medium">
                Based on 1.2k reviews
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "@/services/analytics.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Globe,
  ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardContent() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => getAdminAnalytics(),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics?.summary?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Vendors",
      value: analytics?.summary?.totalVendors || 0,
      icon: Store,
      color: "bg-purple-500",
    },
    {
      title: "Total Shops",
      value: analytics?.summary?.totalShops || 0,
      icon: Globe,
      color: "bg-emerald-500",
    },
    {
      title: "Total Products",
      value: analytics?.summary?.totalProducts || 0,
      icon: Package,
      color: "bg-orange-500",
    },
    {
      title: "Total Orders",
      value: analytics?.summary?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-rose-500",
    },
    {
      title: "Total Revenue",
      value: `৳${analytics?.summary?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
  ];

  // Process chart data
  const rawRevenue = analytics?.monthlyRevenue || [];
  const chartData =
    rawRevenue.length > 0
      ? rawRevenue
          .reduce((acc: any[], order: any) => {
            const month = new Date(order.createdAt).toLocaleString("default", {
              month: "short",
            });
            const existing = acc.find((item) => item.month === month);
            if (existing) {
              existing.amount += order.totalAmount;
            } else {
              acc.push({ month, amount: order.totalAmount });
            }
            return acc;
          }, [])
          .sort((a: any, b: any) => {
            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            return months.indexOf(a.month) - months.indexOf(b.month);
          })
      : [
          { month: "Jan", amount: 4000 },
          { month: "Feb", amount: 3000 },
          { month: "Mar", amount: 5000 },
          { month: "Apr", amount: 4500 },
          { month: "May", amount: 6000 },
          { month: "Jun", amount: 5500 },
        ];

  return (
    <div className="space-y-8 p-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Platform-wide overview and performance analytics.
          </p>
        </div>
        <Link href="/admin/dashboard/analytics">
          <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest shadow-xl shadow-slate-200/50 hover:bg-primary transition-all group">
            Advanced Analytics <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-md shadow-slate-200/50 rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-slate-50 text-slate-400 font-black border-none px-2 py-0.5 rounded-lg text-[10px]"
                >
                  PLATFORM
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-black text-slate-900">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-8">
        <CardHeader className="p-0 mb-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Platform Revenue
              Trend
            </CardTitle>
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary font-bold px-4 py-1"
            >
              Last 6 Months
            </Badge>
          </div>
        </CardHeader>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "16px",
                  border: "none",
                  color: "#fff",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#fff", fontWeight: 800 }}
                labelStyle={{
                  color: "#64748b",
                  marginBottom: "4px",
                  fontWeight: 700,
                }}
                cursor={{
                  stroke: "#3b82f6",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorAmount)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

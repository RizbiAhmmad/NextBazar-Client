/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyShop } from "@/services/shop.services";
import { getVendorAnalytics } from "@/services/analytics.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Store,
  MapPin,
  Calendar,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function SellerDashboard() {
  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ["my-shop"],
    queryFn: () => getMyShop(),
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: () => getVendorAnalytics(),
  });

  if (shopLoading || analyticsLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Skeleton className="h-32 w-32 rounded-3xl" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Store className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          No Shop Found
        </h2>
        <p className="text-muted-foreground max-w-sm mb-8">
          It looks like you haven&apos;t created a shop yet. Create one now to
          start selling your products!
        </p>
        <Link href="/seller/create-shop">
          <Button className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-5 w-5" /> Create My Shop
          </Button>
        </Link>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: analytics?.summary?.totalProducts || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Sales",
      value: analytics?.summary?.totalSales || 0,
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      title: "Total Earnings",
      value: `৳${analytics?.summary?.totalEarnings.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Items Sold",
      value: analytics?.summary?.itemsSold || 0,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8 p-2 md:p-6 pb-20">
      {/* Shop Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="relative flex flex-col md:flex-row gap-8 items-start">
          <div className="relative h-32 w-32 shrink-0 group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-blue-600 rounded-[2rem] opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-md">
              <Image
                src={shop.logo || "/placeholder.png"}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {shop.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full text-sm">
                    <MapPin className="h-4 w-4 text-primary" /> {shop.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full text-sm">
                    <Calendar className="h-4 w-4 text-primary" /> Joined{" "}
                    {new Date(shop.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl font-bold border-slate-200"
                  asChild
                >
                  <Link href="/seller/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" /> Edit Shop
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl font-medium">
              {shop.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  LIFETIME
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

      {/* Recent Sales Table */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 px-8 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900">
              Recent Sales
            </CardTitle>
            <Link href="/seller/dashboard/orders">
              <Button
                variant="link"
                className="font-black text-primary uppercase tracking-widest text-xs"
              >
                View All Orders
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {analytics?.recentSales?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Product
                    </th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                      Earning
                    </th>
                    <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {analytics.recentSales.map((sale: any) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                            <Image
                              src={sale.product.images[0] || "/placeholder.png"}
                              alt={sale.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-bold text-slate-800 line-clamp-1">
                            {sale.product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm font-medium text-slate-500">
                        {new Date(sale.order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 font-black text-slate-900">
                        ৳{sale.vendorEarning.toLocaleString()}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <Badge
                          className={`rounded-full font-black text-[10px] uppercase px-3 py-1 ${
                            sale.order.orderStatus === "DELIVERED"
                              ? "bg-green-100 text-green-600 hover:bg-green-100"
                              : "bg-orange-100 text-orange-600 hover:bg-orange-100"
                          }`}
                        >
                          {sale.order.orderStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground font-medium">
                No sales yet. Keep growing your shop!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

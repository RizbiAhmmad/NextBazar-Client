"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyShop } from "@/services/shop.services";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Settings,
  Mail,
  Store,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function MyShopPage() {
  const { data: shop, isLoading } = useQuery({
    queryKey: ["my-shop"],
    queryFn: () => getMyShop(),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
          <Skeleton className="h-96 rounded-3xl" />
        </div>
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
          It looks like you haven&apos;t created a shop yet.
        </p>
        <Link href="/seller/create-shop">
          <Button className="h-12 px-8 rounded-xl font-bold">
            Create My Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-2 md:p-6 pb-24 max-w-6xl mx-auto">
      {/* Banner & Logo Section */}
      <div className="relative group">
        <div className="relative h-[250px] md:h-[350px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
          <Image
            src={
              shop.banner ||
              "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
            }
            alt="Shop Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Profile Card Overlay */}
        <div className="absolute -bottom-16 left-8 right-8 md:left-12 md:right-12">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center md:items-end">
            <div className="relative -mt-20 md:-mt-24 h-32 w-32 md:h-40 md:w-40 shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-blue-600 rounded-[2.5rem] opacity-20 blur-lg" />
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl bg-white">
                <Image
                  src={shop.logo || "/placeholder.png"}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {shop.name}
                </h1>
                <Badge
                  className={`w-fit mx-auto md:mx-0 rounded-full font-black text-[10px] uppercase px-3 py-1 ${
                    shop.status === "ACTIVE"
                      ? "bg-green-100 text-green-600 hover:bg-green-100"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  {shop.status}
                </Badge>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />{" "}
                  {shop.location || "Online Store"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> Established{" "}
                  {new Date(shop.createdAt).getFullYear()}
                </span>
              </div>
            </div>

            <Button
              className="rounded-2xl font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-primary/20"
              asChild
            >
              <Link href="/seller/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* About Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                About Our Shop
              </h2>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              {shop.description || "No description provided for this shop yet."}
            </p>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Store Policies
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 text-sm mb-1">
                  Standard Shipping
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Delivered within 3-5 business days across the country.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800 text-sm mb-1">
                  Return Policy
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  7-day easy return policy for damaged or incorrect items.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-primary text-white p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <p className="text-primary-foreground/70 text-xs font-black uppercase tracking-widest">
                  Commission Rate
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-black">
                    {shop.commissionRate}%
                  </h3>
                </div>
              </div>
              <div className="h-px bg-white/20 w-full" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary-foreground/60" />
                  <span className="text-sm font-bold truncate">
                    {shop.vendor?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Store className="h-4 w-4 text-primary-foreground/60" />
                  <span className="text-sm font-bold uppercase tracking-tighter">
                    Shop ID: {shop.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
            <h3 className="font-black text-slate-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl font-bold border-slate-100 hover:bg-slate-50"
                asChild
              >
                <Link href="/seller/dashboard/products">Manage Products</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl font-bold border-slate-100 hover:bg-slate-50"
                asChild
              >
                <Link href="/seller/dashboard/orders">Recent Orders</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl font-bold border-slate-100 hover:bg-slate-50"
                asChild
              >
                <Link href="/">View as Customer</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

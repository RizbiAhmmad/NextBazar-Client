"use client";

import StatsCard from "@/components/shared/StatsCard";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const AdminDashboardContent = () => {
  const { data: adminDashboardData, isLoading } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const { data } = (adminDashboardData as ApiResponse<IAdminDashboardData>) ?? {
    data: null,
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Users"
          value={isLoading ? "—" : (data?.userCount ?? 0)}
          iconName="Users"
          description="Registered users on the platform"
        />
        <StatsCard
          title="Total Admins"
          value={isLoading ? "—" : (data?.adminCount ?? 0)}
          iconName="Shield"
          description="Active administrators"
        />
        <StatsCard
          title="Super Admins"
          value={isLoading ? "—" : (data?.superAdminCount ?? 0)}
          iconName="ShieldCheck"
          description="Platform super administrators"
        />
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Analytics",
              icon: "📊",
              href: "/admin/dashboard/analytics",
              desc: "Revenue & sales insights",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;

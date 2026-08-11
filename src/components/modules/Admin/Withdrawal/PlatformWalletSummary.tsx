"use client";

import StatsCard from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlatformWalletSummary } from "@/services/admin.withdrawal.services";
import { IWalletSummary } from "@/types/withdrawal.types";
import { useQuery } from "@tanstack/react-query";

const fmt = (v: number) => `৳${Number(v || 0).toFixed(2)}`;

const PlatformWalletSummary = () => {
  const { data: summaryResponse, isLoading } = useQuery({
    queryKey: ["platform-wallet-summary"],
    queryFn: () => getPlatformWalletSummary(),
  });

  const summary: IWalletSummary = summaryResponse?.data || {
    totalEarned: 0,
    totalWithdrawn: 0,
    totalPending: 0,
    availableBalance: 0,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatsCard
        title="Total Earned"
        value={fmt(summary.totalEarned)}
        iconName="TrendingUp"
        description="Across all sellers, paid orders"
      />
      <StatsCard
        title="Total Withdrawn"
        value={fmt(summary.totalWithdrawn)}
        iconName="CheckCircle2"
        description="Approved withdrawals"
      />
      <StatsCard
        title="Pending Requests"
        value={fmt(summary.totalPending)}
        iconName="Clock"
        description="Awaiting your review"
      />
      <StatsCard
        title="Unwithdrawn Balance"
        value={fmt(summary.availableBalance)}
        iconName="Landmark"
        description="Still owed to sellers"
        className="border-primary/40"
      />
    </div>
  );
};

export default PlatformWalletSummary;

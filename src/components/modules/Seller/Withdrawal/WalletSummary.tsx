"use client";

import StatsCard from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyWalletSummary } from "@/services/withdrawal.services";
import { IWalletSummary } from "@/types/withdrawal.types";
import { useQuery } from "@tanstack/react-query";

const fmt = (v: number) => `৳${Number(v || 0).toFixed(2)}`;

const WalletSummary = () => {
  const { data: summaryResponse, isLoading } = useQuery({
    queryKey: ["wallet-summary"],
    queryFn: () => getMyWalletSummary(),
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
        description="From paid orders"
      />
      <StatsCard
        title="Total Withdrawn"
        value={fmt(summary.totalWithdrawn)}
        iconName="CheckCircle2"
        description="Approved withdrawals"
      />
      <StatsCard
        title="Pending"
        value={fmt(summary.totalPending)}
        iconName="Clock"
        description="Awaiting admin approval"
      />
      <StatsCard
        title="Available Balance"
        value={fmt(summary.availableBalance)}
        iconName="Landmark"
        description="Ready to withdraw"
        className="border-primary/40"
      />
    </div>
  );
};

export default WalletSummary;

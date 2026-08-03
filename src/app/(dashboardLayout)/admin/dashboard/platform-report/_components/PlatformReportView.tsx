"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatsCard from "@/components/shared/StatsCard";
import DataTable from "@/components/shared/table/DataTable";
import { Download } from "lucide-react";
import {
  getPlatformItems,
  getPlatformOverview,
  getPlatformSummary,
} from "@/services/platformReport.services";
import {
  IPeriodSummary,
  IPlatformReportItem,
  IPlatformReportTotals,
} from "@/types/platformReport.types";
import { platformReportColumns } from "./platformReportColumns";

type PeriodFilter = "all" | "today" | "week" | "month" | "range";

const GMV_COLOR = "#2a78d6";
const COMMISSION_COLOR = "#eb6834";
const PAYOUT_COLOR = "#1baf7a";

const CHANNEL_COLORS: Record<string, string> = {
  ONLINE: "#2a78d6",
  POS: "#eb6834",
  LANDING_PAGE: "#1baf7a",
};

const STATUS_BADGE_VARIANT: Record<string, "secondary" | "outline" | "default" | "destructive"> = {
  PENDING: "secondary",
  PROCESSING: "outline",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

const emptyPeriod: IPeriodSummary = {
  today: 0,
  yesterday: 0,
  thisWeek: 0,
  lastWeek: 0,
  thisMonth: 0,
  lastMonth: 0,
  allTime: 0,
};

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

const computeRange = (
  filter: PeriodFilter,
  startDate: string,
  endDate: string,
): Record<string, string> => {
  const now = new Date();

  if (filter === "today") {
    const d = toDateInput(now);
    return { startDate: d, endDate: d };
  }
  if (filter === "week") {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { startDate: toDateInput(start), endDate: toDateInput(now) };
  }
  if (filter === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: toDateInput(start), endDate: toDateInput(now) };
  }
  if (filter === "range" && startDate && endDate) {
    return { startDate, endDate };
  }
  return {};
};

const fmt = (v: number) => `৳${Number(v || 0).toFixed(2)}`;

export default function PlatformReportView() {
  const [filter, setFilter] = useState<PeriodFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: summaryRes, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["platform-summary"],
    queryFn: () => getPlatformSummary(),
  });

  const summary = summaryRes?.data;
  const gmv = summary?.gmv ?? emptyPeriod;
  const commission = summary?.commission ?? emptyPeriod;
  const vendorPayout = summary?.vendorPayout ?? emptyPeriod;

  const range = computeRange(filter, startDate, endDate);

  const { data: overviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["platform-overview", range.startDate, range.endDate],
    queryFn: () => getPlatformOverview(range),
  });

  const overview = overviewRes?.data;

  const { data: itemsRes, isLoading: isItemsLoading } = useQuery({
    queryKey: ["platform-items", range.startDate, range.endDate],
    queryFn: () => getPlatformItems(range),
  });

  const items: IPlatformReportItem[] = itemsRes?.data?.items ?? [];
  const totals: IPlatformReportTotals = itemsRes?.data?.totals ?? {
    totalGmv: 0,
    totalCommission: 0,
    totalVendorPayout: 0,
    totalQuantity: 0,
  };

  const comparisonData = [
    { name: "Today", GMV: gmv.today, Commission: commission.today, Payout: vendorPayout.today },
    {
      name: "This Week",
      GMV: gmv.thisWeek,
      Commission: commission.thisWeek,
      Payout: vendorPayout.thisWeek,
    },
    {
      name: "This Month",
      GMV: gmv.thisMonth,
      Commission: commission.thisMonth,
      Payout: vendorPayout.thisMonth,
    },
  ];

  const channelData =
    overview?.byOrderType.map((c) => ({
      name: c.orderType === "LANDING_PAGE" ? "Landing Page" : c.orderType,
      GMV: c.gmv,
      fill: CHANNEL_COLORS[c.orderType] || GMV_COLOR,
    })) ?? [];

  const handleApplyRange = () => {
    if (startDate && endDate) setFilter("range");
  };

  const exportToExcel = () => {
    const rows = items.map((item) => ({
      Shop: item.shop?.name,
      Product: item.product?.name,
      Variant: item.productVariant?.combination || "-",
      Price: item.price,
      Quantity: item.quantity,
      TotalGMV: item.lineTotal,
      Commission: item.platformEarning,
      VendorPayout: item.vendorEarning,
      OrderNo: item.order?.orderNumber,
      OrderType: item.order?.orderType,
      Date: item.order?.createdAt
        ? new Date(item.order.createdAt).toLocaleDateString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Platform Report");
    XLSX.writeFile(workbook, `platform-report-${filter}.xlsx`);
  };

  if (isSummaryLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* All-time headline */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard title="Total GMV" value={fmt(gmv.allTime)} iconName="TrendingUp" />
        <StatsCard
          title="Platform Commission"
          value={fmt(commission.allTime)}
          iconName="BadgeDollarSign"
          description="Admin's actual revenue"
        />
        <StatsCard
          title="Vendor Payout"
          value={fmt(vendorPayout.allTime)}
          iconName="Wallet"
          description="Total earned by all sellers"
        />
        <StatsCard
          title="Avg. Order Value"
          value={fmt(overview?.totals.avgOrderValue ?? 0)}
          iconName="Receipt"
          description={`${overview?.totals.orderCount ?? 0} orders in selected range`}
        />
      </div>

      {/* Comparison chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            GMV, Commission &amp; Vendor Payout by Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e0d9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#898781", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#898781", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                  }}
                  formatter={(value) => fmt(Number(value))}
                />
                <Legend iconType="circle" />
                <Bar dataKey="GMV" fill={GMV_COLOR} radius={[6, 6, 0, 0]} barSize={24} />
                <Bar
                  dataKey="Commission"
                  fill={COMMISSION_COLOR}
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
                <Bar dataKey="Payout" fill={PAYOUT_COLOR} radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Channel mix + status funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Orders by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e1e0d9" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#898781", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{ fill: "#898781", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                    }}
                    formatter={(value) => fmt(Number(value))}
                  />
                  <Bar dataKey="GMV" radius={[0, 6, 6, 0]} barSize={28}>
                    {channelData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isOverviewLoading ? (
              <Skeleton className="h-[280px] rounded-xl" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {overview?.byOrderStatus.map((s) => (
                  <div
                    key={s.orderStatus}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <Badge
                      variant={STATUS_BADGE_VARIANT[s.orderStatus] ?? "secondary"}
                      className="font-semibold"
                    >
                      {s.orderStatus}
                    </Badge>
                    <span className="text-xl font-bold">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top shops + top products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop</TableHead>
                  <TableHead>GMV</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview?.topShops.length ? (
                  overview.topShops.map((shop) => (
                    <TableRow key={shop.shopId}>
                      <TableCell className="font-semibold">{shop.name}</TableCell>
                      <TableCell>{fmt(shop.gmv)}</TableCell>
                      <TableCell>{fmt(shop.commission)}</TableCell>
                      <TableCell>{shop.orderCount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                      No data for this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview?.topProducts.length ? (
                  overview.topProducts.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-semibold">{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{fmt(product.revenue)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                      No data for this period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Detailed Table */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base font-bold">Detailed Order Items</CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            {(["all", "today", "week", "month"] as PeriodFilter[]).map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All"
                  : f === "today"
                    ? "Today"
                    : f === "week"
                      ? "This Week"
                      : "This Month"}
              </Button>
            ))}

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 w-[140px]"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 w-[140px]"
            />
            <Button type="button" size="sm" onClick={handleApplyRange}>
              Apply
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            data={items}
            columns={platformReportColumns}
            isLoading={isItemsLoading}
            emptyMessage="No delivered orders found for this period."
            toolbarAction={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={exportToExcel}
                disabled={items.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
            }
          />

          {/* Grand Total */}
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border bg-muted/30 p-4 text-sm font-semibold sm:grid-cols-4">
            <div className="flex justify-between sm:block">
              <span className="text-muted-foreground">Total GMV</span>
              <span className="text-lg font-bold sm:mt-1 sm:block">{fmt(totals.totalGmv)}</span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="text-muted-foreground">Total Commission</span>
              <span className="text-lg font-bold sm:mt-1 sm:block">
                {fmt(totals.totalCommission)}
              </span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="text-muted-foreground">Total Vendor Payout</span>
              <span className="text-lg font-bold sm:mt-1 sm:block">
                {fmt(totals.totalVendorPayout)}
              </span>
            </div>
            <div className="flex justify-between sm:block">
              <span className="text-muted-foreground">Total Quantity</span>
              <span className="text-lg font-bold sm:mt-1 sm:block">{totals.totalQuantity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

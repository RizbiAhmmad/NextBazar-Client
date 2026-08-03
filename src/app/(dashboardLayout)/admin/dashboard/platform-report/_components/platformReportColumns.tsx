"use client";

import { Badge } from "@/components/ui/badge";
import { IPlatformReportItem } from "@/types/platformReport.types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const platformReportColumns: ColumnDef<IPlatformReportItem>[] = [
  {
    id: "shop",
    header: "Shop",
    cell: ({ row }) => (
      <div className="font-semibold text-sm">{row.original.shop?.name}</div>
    ),
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.original.product?.name}</span>
        {row.original.productVariant?.combination && (
          <span className="text-xs text-muted-foreground">
            {row.original.productVariant.combination}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div>৳{Number(row.original.price).toFixed(2)}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    id: "total",
    header: "Total (GMV)",
    cell: ({ row }) => (
      <div className="font-bold">৳{row.original.lineTotal.toFixed(2)}</div>
    ),
  },
  {
    id: "commission",
    header: "Commission",
    cell: ({ row }) => (
      <div className="font-semibold text-primary">
        ৳{Number(row.original.platformEarning).toFixed(2)}
      </div>
    ),
  },
  {
    id: "vendorPayout",
    header: "Vendor Payout",
    cell: ({ row }) => <div>৳{Number(row.original.vendorEarning).toFixed(2)}</div>,
  },
  {
    id: "orderNumber",
    header: "Order No.",
    cell: ({ row }) => (
      <div className="font-mono text-xs font-bold">{row.original.order?.orderNumber}</div>
    ),
  },
  {
    id: "orderType",
    header: "Order Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-semibold text-[10px]">
        {row.original.order?.orderType}
      </Badge>
    ),
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.original.order?.createdAt
          ? format(new Date(row.original.order.createdAt), "MMM d, yyyy")
          : "-"}
      </div>
    ),
  },
];

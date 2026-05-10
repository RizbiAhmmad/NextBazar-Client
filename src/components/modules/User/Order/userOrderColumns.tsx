/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/types/order.types";
import { format } from "date-fns";

export const userOrderColumns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs uppercase">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <div className="font-bold">
        ৳{Number(row.getValue("totalAmount")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      const variants: Record<string, string> = {
        PENDING: "secondary",
        PROCESSING: "outline",
        SHIPPED: "default",
        DELIVERED: "default",
        CANCELLED: "destructive",
      };
      return (
        <Badge variant={variants[status] as any} className="font-semibold">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          variant={status === "PAID" ? "default" : "secondary"}
          className="font-semibold"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>
    ),
  },
];

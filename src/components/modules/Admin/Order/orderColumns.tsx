/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { IOrder } from "@/types/order.types";
import { format } from "date-fns";

export const orderColumns: ColumnDef<IOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderNumber",
    header: "Order No.",
    cell: ({ row }) => (
      <div className="font-mono text-xs font-bold">{row.getValue("orderNumber")}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("fullName")}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.phone}
        </span>
      </div>
    ),
  },
  {
    id: "store",
    header: "Store",
    cell: ({ row }) => {
      const order = row.original;
      const storeNames = order.shop
        ? [order.shop.name]
        : Array.from(
            new Set(
              (order.items ?? [])
                .map((item) => item.shop?.name)
                .filter((name): name is string => Boolean(name)),
            ),
          );

      if (storeNames.length === 0) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium">{storeNames[0]}</span>
          {storeNames.length > 1 && (
            <span className="text-xs text-muted-foreground">
              +{storeNames.length - 1} more
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-bold">
        ৳{Number(row.getValue("totalAmount")).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
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
    header: "Date",
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>
    ),
  },
];

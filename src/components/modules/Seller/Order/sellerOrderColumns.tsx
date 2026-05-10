/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import Image from "next/image";

export const sellerOrderColumns: ColumnDef<any>[] = [
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
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-mono text-[10px] uppercase truncate w-20">
        {row.original.orderId}
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-lg overflow-hidden border">
          <Image
            src={row.original.product?.images?.[0] || "/placeholder.png"}
            alt={row.original.product?.name || "Product"}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm truncate max-w-[200px]">
            {row.original.product?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            Qty: {row.original.quantity}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "vendorEarning",
    header: "My Earning",
    cell: ({ row }) => (
      <div className="font-black text-primary">
        ৳{Number(row.original.vendorEarning).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Fulfillment",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants: Record<string, string> = {
        PENDING: "secondary",
        PROCESSING: "outline",
        SHIPPED: "default",
        DELIVERED: "default",
        CANCELLED: "destructive",
      };
      return (
        <Badge
          variant={variants[status] as any}
          className="font-semibold text-[10px]"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-bold">{row.original.order?.fullName}</span>
        <span className="text-muted-foreground">
          {row.original.order?.phone}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Order Date",
    cell: ({ row }) => (
      <div className="text-xs">
        {format(new Date(row.original.order?.createdAt), "MMM d, yyyy")}
      </div>
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IShop } from "@/types/shop.types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { Store } from "lucide-react";

const statusConfig = {
  ACTIVE: {
    label: "Active",
    variant: "default" as const,
    className: "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20",
  },
  PENDING: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20",
  },
  BLOCKED: {
    label: "Blocked",
    variant: "destructive" as const,
    className: "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20",
  },
};

export const shopColumns: ColumnDef<IShop>[] = [
  {
    accessorKey: "name",
    header: "Shop",
    cell: ({ row }) => {
      const shop = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
            {shop.logo ? (
              <Image
                src={shop.logo}
                alt={shop.name}
                width={40}
                height={40}
                className="object-cover h-full w-full"
              />
            ) : (
              <Store className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{shop.name}</p>
            {shop.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                {shop.description}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "vendor",
    header: "Vendor",
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      if (!vendor) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{vendor.name}</span>
          <span className="text-xs text-muted-foreground">{vendor.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusConfig[status];
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "commissionRate",
    header: "Commission",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.commissionRate}%</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Applied On",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.original.createdAt), "dd MMM yyyy")}
      </span>
    ),
  },
];

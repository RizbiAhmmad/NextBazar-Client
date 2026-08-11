/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { IWithdrawalRequest } from "@/types/withdrawal.types";
import { format } from "date-fns";

const statusVariants: Record<string, string> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export const withdrawalColumns: ColumnDef<IWithdrawalRequest>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-bold">৳{Number(row.getValue("amount")).toFixed(2)}</div>
    ),
  },
  {
    id: "payoutMethod",
    header: "Payout Method",
    cell: ({ row }) => {
      const request = row.original;
      if (request.payoutMethod === "MOBILE_BANKING") {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{request.mobileBankingProvider}</span>
            <span className="text-xs text-muted-foreground">{request.mobileNumber}</span>
          </div>
        );
      }
      return (
        <div className="flex flex-col">
          <span className="font-medium">{request.bankName}</span>
          <span className="text-xs text-muted-foreground">
            {request.bankAccountNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const requestStatus = row.getValue("status") as string;
      return (
        <Badge variant={statusVariants[requestStatus] as any} className="font-semibold">
          {requestStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>
    ),
  },
  {
    id: "adminNote",
    header: "Admin Note",
    cell: ({ row }) => {
      const request = row.original;
      if (request.status === "PENDING" || !request.adminNote) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }
      return <div className="max-w-xs text-sm">{request.adminNote}</div>;
    },
  },
];

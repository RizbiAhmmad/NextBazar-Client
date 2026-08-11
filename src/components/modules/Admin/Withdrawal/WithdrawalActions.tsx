"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IWithdrawalRequest } from "@/types/withdrawal.types";
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react";
import { useState } from "react";
import ApproveWithdrawalDialog from "./ApproveWithdrawalDialog";
import RejectWithdrawalDialog from "./RejectWithdrawalDialog";

const WithdrawalActions = ({ withdrawal }: { withdrawal: IWithdrawalRequest }) => {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  if (withdrawal.status !== "PENDING") {
    return (
      <span className="text-xs text-muted-foreground">
        {withdrawal.status === "APPROVED" ? "Paid" : "Reviewed"}
      </span>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Review Request</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-green-600 focus:text-green-600 focus:bg-green-50"
            onClick={() => setIsApproveOpen(true)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setIsRejectOpen(true)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ApproveWithdrawalDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        withdrawal={withdrawal}
      />
      <RejectWithdrawalDialog
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        withdrawal={withdrawal}
      />
    </>
  );
};

export default WithdrawalActions;

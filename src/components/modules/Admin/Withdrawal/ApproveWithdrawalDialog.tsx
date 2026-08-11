"use client";

import { approveWithdrawalRequestAction } from "@/app/(dashboardLayout)/admin/dashboard/withdrawals/_action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IWithdrawalRequest } from "@/types/withdrawal.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import PayoutDetails from "./PayoutDetails";

interface ApproveWithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawal: IWithdrawalRequest | null;
}

const ApproveWithdrawalDialog = ({
  open,
  onOpenChange,
  withdrawal,
}: ApproveWithdrawalDialogProps) => {
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => approveWithdrawalRequestAction(id, note || undefined),
  });

  const handleConfirm = async () => {
    if (!withdrawal) return;

    const result = await mutateAsync(withdrawal.id);

    if (!result.success) {
      toast.error(result.message || "Failed to approve withdrawal request");
      return;
    }

    toast.success(result.message || "Withdrawal request approved");
    setNote("");
    onOpenChange(false);

    void queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    void queryClient.invalidateQueries({ queryKey: ["platform-wallet-summary"] });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
          <AlertDialogDescription>
            Approve a payout of <strong>৳{Number(withdrawal?.amount || 0).toFixed(2)}</strong> to{" "}
            <strong>{withdrawal?.shop?.name}</strong>. This confirms the seller has been paid.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {withdrawal && <PayoutDetails withdrawal={withdrawal} />}

        <div className="space-y-1.5">
          <Label>Note (optional)</Label>
          <Textarea
            placeholder="e.g. Transaction ID, reference note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            disabled={isPending}
          >
            {isPending ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApproveWithdrawalDialog;

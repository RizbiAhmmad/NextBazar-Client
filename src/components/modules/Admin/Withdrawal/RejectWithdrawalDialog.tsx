"use client";

import { rejectWithdrawalRequestAction } from "@/app/(dashboardLayout)/admin/dashboard/withdrawals/_action";
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

interface RejectWithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawal: IWithdrawalRequest | null;
}

const RejectWithdrawalDialog = ({
  open,
  onOpenChange,
  withdrawal,
}: RejectWithdrawalDialogProps) => {
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => rejectWithdrawalRequestAction(id, note.trim()),
  });

  const handleConfirm = async () => {
    if (!withdrawal || !note.trim()) return;

    const result = await mutateAsync(withdrawal.id);

    if (!result.success) {
      toast.error(result.message || "Failed to reject withdrawal request");
      return;
    }

    toast.success(result.message || "Withdrawal request rejected");
    setNote("");
    onOpenChange(false);

    void queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    void queryClient.invalidateQueries({ queryKey: ["platform-wallet-summary"] });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Withdrawal</AlertDialogTitle>
          <AlertDialogDescription>
            Reject the withdrawal request of{" "}
            <strong>৳{Number(withdrawal?.amount || 0).toFixed(2)}</strong> from{" "}
            <strong>{withdrawal?.shop?.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {withdrawal && <PayoutDetails withdrawal={withdrawal} />}

        <div className="space-y-1.5">
          <Label>
            Reason <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Explain why this request is being rejected..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            disabled={isPending || !note.trim()}
          >
            {isPending ? "Rejecting..." : "Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectWithdrawalDialog;

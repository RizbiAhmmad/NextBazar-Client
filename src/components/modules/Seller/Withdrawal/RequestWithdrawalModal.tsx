"use client";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWithdrawalRequest, getMyWalletSummary } from "@/services/withdrawal.services";
import { IWalletSummary } from "@/types/withdrawal.types";
import { withdrawalRequestZodSchema } from "@/zod/withdrawal.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Landmark, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const defaultValues = {
  amount: 0,
  payoutMethod: "MOBILE_BANKING" as "MOBILE_BANKING" | "BANK_TRANSFER",
  mobileBankingProvider: "BKASH" as "BKASH" | "NAGAD",
  mobileNumber: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankBranch: "",
  bankRoutingNumber: "",
};

const fmt = (v: number) => `৳${Number(v || 0).toFixed(2)}`;

const RequestWithdrawalModal = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: summaryResponse } = useQuery({
    queryKey: ["wallet-summary"],
    queryFn: () => getMyWalletSummary(),
    enabled: open,
  });

  const summary: IWalletSummary = summaryResponse?.data || {
    totalEarned: 0,
    totalWithdrawn: 0,
    totalPending: 0,
    availableBalance: 0,
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createWithdrawalRequest,
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const payload = {
        amount: Number(value.amount),
        payoutMethod: value.payoutMethod,
        ...(value.payoutMethod === "MOBILE_BANKING"
          ? {
              mobileBankingProvider: value.mobileBankingProvider,
              mobileNumber: value.mobileNumber,
            }
          : {
              bankName: value.bankName,
              bankAccountName: value.bankAccountName,
              bankAccountNumber: value.bankAccountNumber,
              bankBranch: value.bankBranch,
              bankRoutingNumber: value.bankRoutingNumber || undefined,
            }),
      };

      const parsed = withdrawalRequestZodSchema.safeParse(payload);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Please check the form");
        return;
      }

      if (payload.amount > summary.availableBalance) {
        toast.error(`Amount exceeds your available balance (${fmt(summary.availableBalance)})`);
        return;
      }

      try {
        const result = await mutateAsync(payload);

        if (!result.success) {
          toast.error(result.message || "Failed to submit withdrawal request");
          return;
        }

        toast.success(result.message || "Withdrawal request submitted successfully");
        setOpen(false);
        form.reset();

        void queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
        void queryClient.invalidateQueries({ queryKey: ["wallet-summary"] });
        router.refresh();
      } catch (error) {
        const message = isAxiosError(error) ? error.response?.data?.message : undefined;
        toast.error(message || "Something went wrong");
      }
    },
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) form.reset();
    },
    [form],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="ml-auto shrink-0 gap-1.5 shadow-md">
          <Plus className="size-4" />
          Request Withdrawal
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-h-[95vh] w-[calc(100vw-1.5rem)] max-w-lg gap-0 overflow-hidden p-0"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Landmark className="size-5 text-primary" />
            Request Withdrawal
          </DialogTitle>
          <DialogDescription>
            Available balance: <strong>{fmt(summary.availableBalance)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(95vh-11rem)] overflow-y-auto px-6 py-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field name="amount">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Amount (৳)</Label>
                  <Input
                    type="number"
                    min="0"
                    max={summary.availableBalance || undefined}
                    step="any"
                    placeholder="0.00"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="payoutMethod">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Payout Method</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as "MOBILE_BANKING" | "BANK_TRANSFER")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOBILE_BANKING">Mobile Banking (bKash/Nagad)</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.values.payoutMethod}>
              {(payoutMethod) =>
                payoutMethod === "MOBILE_BANKING" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field name="mobileBankingProvider">
                      {(field) => (
                        <div className="space-y-1.5">
                          <Label>Provider</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) =>
                              field.handleChange(value as "BKASH" | "NAGAD")
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BKASH">bKash</SelectItem>
                              <SelectItem value="NAGAD">Nagad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="mobileNumber">
                      {(field) => (
                        <div className="space-y-1.5">
                          <Label>Mobile Number</Label>
                          <Input
                            placeholder="01XXXXXXXXX"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <form.Field name="bankName">
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label>Bank Name</Label>
                            <Input
                              placeholder="e.g. Dutch-Bangla Bank"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="bankBranch">
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label>Branch</Label>
                            <Input
                              placeholder="e.g. Gulshan"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <form.Field name="bankAccountName">
                      {(field) => (
                        <div className="space-y-1.5">
                          <Label>Account Holder Name</Label>
                          <Input
                            placeholder="Name on the account"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    </form.Field>

                    <div className="grid grid-cols-2 gap-4">
                      <form.Field name="bankAccountNumber">
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label>Account Number</Label>
                            <Input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="bankRoutingNumber">
                        {(field) => (
                          <div className="space-y-1.5">
                            <Label>Routing Number (optional)</Label>
                            <Input
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>
                )
              }
            </form.Subscribe>

            <DialogFooter className="border-t pt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <AppSubmitButton isPending={isPending} pendingLabel="Submitting..." className="w-auto">
                Submit Request
              </AppSubmitButton>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestWithdrawalModal;

"use server";

import {
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} from "@/services/admin.withdrawal.services";
import { revalidatePath } from "next/cache";

const getActionErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

export const approveWithdrawalRequestAction = async (id: string, note?: string) => {
  try {
    const result = await approveWithdrawalRequest(id, note);
    if (result.success) {
      revalidatePath("/admin/dashboard/withdrawals");
    }
    return result;
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to approve withdrawal request"),
    };
  }
};

export const rejectWithdrawalRequestAction = async (id: string, note: string) => {
  try {
    const result = await rejectWithdrawalRequest(id, note);
    if (result.success) {
      revalidatePath("/admin/dashboard/withdrawals");
    }
    return result;
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to reject withdrawal request"),
    };
  }
};

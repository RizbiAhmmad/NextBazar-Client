"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IWalletSummary, IWithdrawalRequest } from "@/types/withdrawal.types";

export const getAllWithdrawalRequests = async (
  queryParams?: Record<string, string>,
) => {
  try {
    return await httpClient.get<IWithdrawalRequest[]>("/withdrawals", {
      params: queryParams,
    });
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    throw error;
  }
};

export const getPlatformWalletSummary = async () => {
  try {
    return await httpClient.get<IWalletSummary>("/withdrawals/summary");
  } catch (error) {
    console.error("Error fetching platform wallet summary:", error);
    throw error;
  }
};

export const approveWithdrawalRequest = async (id: string, note?: string) => {
  try {
    return await httpClient.patch<IWithdrawalRequest>(`/withdrawals/${id}/approve`, {
      note,
    });
  } catch (error) {
    console.error("Error approving withdrawal request:", error);
    throw error;
  }
};

export const rejectWithdrawalRequest = async (id: string, note: string) => {
  try {
    return await httpClient.patch<IWithdrawalRequest>(`/withdrawals/${id}/reject`, {
      note,
    });
  } catch (error) {
    console.error("Error rejecting withdrawal request:", error);
    throw error;
  }
};

"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreateWithdrawalRequestPayload,
  IWalletSummary,
  IWithdrawalRequest,
} from "@/types/withdrawal.types";

export const createWithdrawalRequest = async (
  payload: ICreateWithdrawalRequestPayload,
) => {
  try {
    return await httpClient.post<IWithdrawalRequest>("/withdrawals", payload);
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    throw error;
  }
};

export const getMyWithdrawalRequests = async (
  queryParams?: Record<string, string>,
) => {
  try {
    return await httpClient.get<IWithdrawalRequest[]>("/withdrawals/my-requests", {
      params: queryParams,
    });
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    throw error;
  }
};

export const getMyWalletSummary = async () => {
  try {
    return await httpClient.get<IWalletSummary>("/withdrawals/my-summary");
  } catch (error) {
    console.error("Error fetching wallet summary:", error);
    throw error;
  }
};

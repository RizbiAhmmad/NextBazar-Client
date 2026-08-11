export type WithdrawalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PayoutMethod = "MOBILE_BANKING" | "BANK_TRANSFER";
export type MobileBankingProvider = "BKASH" | "NAGAD";

export interface IWithdrawalRequest {
  id: string;
  amount: number;
  status: WithdrawalStatus;

  payoutMethod: PayoutMethod;
  mobileBankingProvider?: MobileBankingProvider | null;
  mobileNumber?: string | null;

  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankBranch?: string | null;
  bankRoutingNumber?: string | null;

  adminNote?: string | null;
  reviewedAt?: string | null;
  reviewedByAdminId?: string | null;

  shopId: string;
  shop?: {
    id: string;
    name: string;
    vendorId: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ICreateWithdrawalRequestPayload {
  amount: number;
  payoutMethod: PayoutMethod;
  mobileBankingProvider?: MobileBankingProvider;
  mobileNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  bankRoutingNumber?: string;
}

export interface IWalletSummary {
  totalEarned: number;
  totalWithdrawn: number;
  totalPending: number;
  availableBalance: number;
}

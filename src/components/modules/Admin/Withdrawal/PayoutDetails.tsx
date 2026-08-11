import { IWithdrawalRequest } from "@/types/withdrawal.types";

const Row = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
};

const PayoutDetails = ({ withdrawal }: { withdrawal: IWithdrawalRequest }) => {
  return (
    <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
      {withdrawal.payoutMethod === "MOBILE_BANKING" ? (
        <>
          <Row label="Provider" value={withdrawal.mobileBankingProvider} />
          <Row label="Mobile Number" value={withdrawal.mobileNumber} />
        </>
      ) : (
        <>
          <Row label="Bank Name" value={withdrawal.bankName} />
          <Row label="Account Holder" value={withdrawal.bankAccountName} />
          <Row label="Account Number" value={withdrawal.bankAccountNumber} />
          <Row label="Branch" value={withdrawal.bankBranch} />
          <Row label="Routing Number" value={withdrawal.bankRoutingNumber} />
        </>
      )}
    </div>
  );
};

export default PayoutDetails;

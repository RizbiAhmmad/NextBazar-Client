import { z } from "zod";

export const withdrawalRequestZodSchema = z
  .object({
    amount: z.number().positive("Amount must be greater than 0"),
    payoutMethod: z.enum(["MOBILE_BANKING", "BANK_TRANSFER"]),
    mobileBankingProvider: z.enum(["BKASH", "NAGAD"]).optional(),
    mobileNumber: z.string().min(1, "Mobile number is required").optional(),
    bankName: z.string().min(1, "Bank name is required").optional(),
    bankAccountName: z.string().min(1, "Account name is required").optional(),
    bankAccountNumber: z.string().min(1, "Account number is required").optional(),
    bankBranch: z.string().min(1, "Branch is required").optional(),
    bankRoutingNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payoutMethod === "MOBILE_BANKING") {
      if (!data.mobileBankingProvider) {
        ctx.addIssue({
          code: "custom",
          path: ["mobileBankingProvider"],
          message: "Please select bKash or Nagad",
        });
      }
      if (!data.mobileNumber) {
        ctx.addIssue({
          code: "custom",
          path: ["mobileNumber"],
          message: "Mobile number is required",
        });
      }
    }

    if (data.payoutMethod === "BANK_TRANSFER") {
      (["bankName", "bankAccountName", "bankAccountNumber", "bankBranch"] as const).forEach(
        (field) => {
          if (!data[field]) {
            ctx.addIssue({
              code: "custom",
              path: [field],
              message: "This field is required",
            });
          }
        },
      );
    }
  });

export type IWithdrawalRequestFormData = z.infer<typeof withdrawalRequestZodSchema>;

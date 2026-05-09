"use server";

import { changeShopStatus } from "@/services/admin.shop.services";
import { revalidatePath } from "next/cache";
import { ShopStatus } from "@/types/shop.types";

const getActionErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

export const changeShopStatusAction = async (
  shopId: string,
  status: ShopStatus,
) => {
  try {
    const result = await changeShopStatus(shopId, status);
    if (result.success) {
      revalidatePath("/admin/dashboard/shops");
    }
    return result;
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to change shop status"),
    };
  }
};

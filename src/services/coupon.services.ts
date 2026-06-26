"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICoupon, ICreateCouponPayload } from "@/types/coupon.types";

export const createCoupon = async (payload: ICreateCouponPayload) => {
  try {
    return await httpClient.post<ICoupon>("/coupons", payload);
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const getShopCoupons = async (shopId: string, queryParams?: Record<string, string>) => {
  try {
    return await httpClient.get<ICoupon[]>(`/coupons/shop/${shopId}`, {
      params: queryParams,
    });
  } catch (error) {
    console.error("Error fetching shop coupons:", error);
    throw error;
  }
};

export const toggleCouponStatus = async (id: string) => {
  try {
    return await httpClient.patch<ICoupon>(`/coupons/${id}/status`, {});
  } catch (error) {
    console.error("Error toggling coupon status:", error);
    throw error;
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    return await httpClient.delete<any>(`/coupons/${id}`);
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

export const validateCouponCode = async (payload: {
  code: string;
  items: { productId: string; price: number; quantity: number }[];
}) => {
  try {
    return await httpClient.post<{
      couponId: string;
      code: string;
      discountAmount: number;
      discountType: string;
    }>("/coupons/validate", payload);
  } catch (error) {
    console.error("Error validating coupon:", error);
    throw error;
  }
};


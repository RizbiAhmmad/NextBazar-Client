import { IUser } from "./user.types";

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type OrderType = "ONLINE" | "POS" | "LANDING_PAGE";

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productVariantId?: string | null;
  quantity: number;
  returnedQuantity: number;
  price: number;
  shopId: string;
  shop?: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
    images: string[];
  };
  productVariant?: {
    id: string;
    combination: string;
  } | null;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  orderType: OrderType;
  totalAmount: number;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  notes?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  discountAmount: number;
  shippingFee: number;
  couponId?: string | null;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[];
  user: IUser;
  shop?: {
    id: string;
    name: string;
  } | null;
}

// Subset of IOrder returned by the public, unauthenticated order-confirmation endpoint
// (GET /orders/:id/public) — no userId/user/shop/couponId, no vendor-facing item fields.
export interface IPublicOrderItem {
  id: string;
  quantity: number;
  returnedQuantity: number;
  price: number;
  status: OrderStatus;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  productVariant?: {
    id: string;
    combination: string;
  } | null;
}

export interface IPublicOrder {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  notes?: string | null;
  createdAt: string;
  items: IPublicOrderItem[];
}

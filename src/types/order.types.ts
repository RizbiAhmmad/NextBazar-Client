import { IUser } from "./user.types";

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productVariantId?: string | null;
  quantity: number;
  price: number;
  shopId: string;
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
  userId: string;
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
}

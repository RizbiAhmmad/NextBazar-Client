export type ShopStatus = "PENDING" | "ACTIVE" | "BLOCKED";

export interface IShop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  status: ShopStatus;
  commissionRate: number;
  vendorId: string;
  vendor?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

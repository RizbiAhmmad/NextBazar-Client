export interface IPeriodSummary {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  allTime: number;
}

export interface IPlatformSummary {
  gmv: IPeriodSummary;
  commission: IPeriodSummary;
  vendorPayout: IPeriodSummary;
}

export type OrderTypeValue = "ONLINE" | "POS" | "LANDING_PAGE";
export type OrderStatusValue = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface IPlatformOverviewTotals {
  gmv: number;
  commission: number;
  vendorPayout: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface IPlatformOrderTypeBreakdown {
  orderType: OrderTypeValue;
  gmv: number;
  count: number;
}

export interface IPlatformOrderStatusBreakdown {
  orderStatus: OrderStatusValue;
  count: number;
}

export interface IPlatformTopShop {
  shopId: string;
  name: string;
  gmv: number;
  commission: number;
  orderCount: number;
}

export interface IPlatformTopProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface IPlatformOverview {
  totals: IPlatformOverviewTotals;
  byOrderType: IPlatformOrderTypeBreakdown[];
  byOrderStatus: IPlatformOrderStatusBreakdown[];
  topShops: IPlatformTopShop[];
  topProducts: IPlatformTopProduct[];
}

export interface IPlatformReportItem {
  id: string;
  product: { id: string; name: string };
  productVariant?: { id: string; combination: string } | null;
  shop: { id: string; name: string };
  price: number;
  quantity: number;
  lineTotal: number;
  platformEarning: number;
  vendorEarning: number;
  order: {
    orderNumber: string;
    orderType: OrderTypeValue;
    createdAt: string;
  };
}

export interface IPlatformReportTotals {
  totalGmv: number;
  totalCommission: number;
  totalVendorPayout: number;
  totalQuantity: number;
}

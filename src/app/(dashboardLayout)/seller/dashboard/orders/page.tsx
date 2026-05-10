import SellerOrderTable from "@/components/modules/Seller/Order/SellerOrderTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Management | Seller Dashboard",
  description: "Track and fulfill orders for your shop",
};

export default function SellerOrderManagementPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black tracking-tight uppercase">
          Sales Management
        </h2>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <SellerOrderTable />
      </div>
    </div>
  );
}

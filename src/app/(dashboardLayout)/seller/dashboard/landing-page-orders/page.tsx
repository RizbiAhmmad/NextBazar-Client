import SellerOrderTable from "@/components/modules/Seller/Order/SellerOrderTable";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Landing Page Orders | Seller Dashboard",
  description: "Track orders placed through your landing page campaigns",
};

export default function SellerLandingPageOrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black tracking-tight uppercase">
          Landing Page Orders
        </h2>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <Suspense fallback={<div>Loading landing page orders...</div>}>
          <SellerOrderTable orderType="LANDING_PAGE" />
        </Suspense>
      </div>
    </div>
  );
}

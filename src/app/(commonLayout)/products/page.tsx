import ProductListing from "@/components/modules/Product/ProductListing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Products | NextBazar",
  description: "Find the best deals on electronics, fashion, and more at NextBazar.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <ProductListing />
    </div>
  );
}

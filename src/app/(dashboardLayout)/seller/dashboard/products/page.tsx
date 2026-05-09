import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "My Products | Seller Dashboard",
  description: "Manage your shop products",
};

export default async function SellerProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your shop inventory and listings
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-lg">
          <Link href="/seller/dashboard/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center p-12 text-center h-[400px]">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight mb-2">
          No products yet
        </h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          You haven&apos;t added any products to your shop. Add your first
          product to start selling.
        </p>
        <Button asChild>
          <Link href="/seller/dashboard/products/add">
            Add Your First Product
          </Link>
        </Button>
      </div>
    </div>
  );
}

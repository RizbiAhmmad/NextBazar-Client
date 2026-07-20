import ProductTable from "@/components/modules/Seller/Product/ProductTable";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Products | Seller Dashboard",
  description: "Manage your shop products",
};

export default async function SellerProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParams = await searchParams;

  const stringParams: Record<string, string> = {};
  for (const key in queryParams) {
    const value = queryParams[key];
    if (Array.isArray(value)) {
      stringParams[key] = value[0];
    } else if (value !== undefined) {
      stringParams[key] = value as string;
    }
  }

  const initialQueryString = new URLSearchParams(stringParams).toString();

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

      <div className="h-full flex-1 flex-col space-y-8 md:flex mt-6">
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductTable initialQueryString={initialQueryString} />
        </Suspense>
      </div>
    </div>
  );
}

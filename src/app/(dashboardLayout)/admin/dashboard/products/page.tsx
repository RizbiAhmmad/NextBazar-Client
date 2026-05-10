
import { getAllProducts } from "@/services/product.services";
import { Metadata } from "next";
import AdminProductTable from "@/components/modules/Admin/Product/AdminProductTable";

export const metadata: Metadata = {
  title: "Products Management - NextBazar Admin",
  description: "Manage all products in the platform",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const stringParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (value) {
      stringParams[key] = Array.isArray(value) ? value[0] : value;
    }
  }

  const initialQueryString = new URLSearchParams(stringParams).toString();

  // Prefetch first page of products on the server
  // Admin shouldn't pass any shopId, so they get all products.
  await getAllProducts(stringParams);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products Management</h2>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 md:flex bg-card rounded-xl border border-border shadow-sm p-4">
        <AdminProductTable initialQueryString={initialQueryString} />
      </div>
    </div>
  );
}

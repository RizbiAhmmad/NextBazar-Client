"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getAllProducts } from "@/services/product.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { adminProductColumns } from "./adminProductColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const AdminProductTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
    isRouteRefreshPending,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const {
    data: productResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["adminProducts", queryString],
    queryFn: () => {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      return getAllProducts(params);
    },
  });

  const products = productResponse?.data ?? [];
  const meta: PaginationMeta | undefined = productResponse?.meta;

  const columnsWithActions = [
    ...adminProductColumns,
    // Add Admin actions here later (e.g. status change, delete)
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={products}
        columns={columnsWithActions}
        emptyMessage="No products found across any shop."
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        sorting={{
          state: optimisticSortingState,
          onSortingChange: handleSortingChange,
        }}
        pagination={{
          state: optimisticPaginationState,
          onPaginationChange: handlePaginationChange,
        }}
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search products...",
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
      />
    </div>
  );
};

export default AdminProductTable;

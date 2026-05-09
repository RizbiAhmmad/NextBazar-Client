"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getAllShops } from "@/services/admin.shop.services";
import { PaginationMeta } from "@/types/api.types";
import { IShop } from "@/types/shop.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ShopActions from "./ShopActions";
import { shopColumns } from "./shopColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const ShopTable = ({ initialQueryString }: { initialQueryString: string }) => {
  const searchParams = useSearchParams();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
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
    data: shopResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["shops", queryString],
    queryFn: () => {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      return getAllShops(params);
    },
  });

  const shops = shopResponse?.data ?? [];
  const meta: PaginationMeta | undefined = shopResponse?.meta;

  const columnsWithActions = [
    ...shopColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: IShop } }) => (
        <ShopActions shop={row.original} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columnsWithActions}
      data={shops}
      isLoading={isLoading || isFetching || isRouteRefreshPending}
      emptyMessage="No shop applications found."
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
        placeholder: "Search shops by name...",
        debounceMs: 700,
        onDebouncedChange: handleDebouncedSearchChange,
      }}
      meta={meta}
    />
  );
};

export default ShopTable;

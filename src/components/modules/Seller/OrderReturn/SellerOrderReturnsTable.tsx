"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getVendorOrderReturns } from "@/services/orderReturn.services";
import { PaginationMeta } from "@/types/api.types";
import { IOrderReturn } from "@/types/orderReturn.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { orderReturnColumns } from "../../Admin/OrderReturn/orderReturnColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const SellerOrderReturnsTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
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
    data: orderReturnResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["vendor-order-returns", queryString],
    queryFn: () => {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      return getVendorOrderReturns(params);
    },
  });

  const orderReturnList: IOrderReturn[] = orderReturnResponse?.data ?? [];
  const meta: PaginationMeta | undefined = orderReturnResponse?.meta;

  return (
    <DataTable
      data={orderReturnList}
      columns={orderReturnColumns}
      isLoading={isLoading || isFetching || isRouteRefreshPending}
      emptyMessage="No returns found for your shop yet."
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
        placeholder: "Search Order ID / Customer Name...",
        debounceMs: 700,
        onDebouncedChange: handleDebouncedSearchChange,
      }}
      meta={meta}
    />
  );
};

export default SellerOrderReturnsTable;

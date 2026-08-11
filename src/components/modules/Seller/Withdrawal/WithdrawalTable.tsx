"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getMyWithdrawalRequests } from "@/services/withdrawal.services";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import RequestWithdrawalModal from "./RequestWithdrawalModal";
import { withdrawalColumns } from "./withdrawalColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const WithdrawalTable = ({ initialQueryString }: { initialQueryString: string }) => {
  const searchParams = useSearchParams();

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const {
    data: withdrawalResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["withdrawal-requests", queryString],
    queryFn: () => {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      return getMyWithdrawalRequests(params);
    },
  });

  const withdrawals = withdrawalResponse?.data ?? [];
  const meta: PaginationMeta | undefined = withdrawalResponse?.meta;

  return (
    <DataTable
      columns={withdrawalColumns}
      data={withdrawals}
      isLoading={isLoading || isFetching || isRouteRefreshPending}
      emptyMessage="No withdrawal requests yet."
      sorting={{
        state: optimisticSortingState,
        onSortingChange: handleSortingChange,
      }}
      pagination={{
        state: optimisticPaginationState,
        onPaginationChange: handlePaginationChange,
      }}
      toolbarAction={<RequestWithdrawalModal />}
      meta={meta}
    />
  );
};

export default WithdrawalTable;

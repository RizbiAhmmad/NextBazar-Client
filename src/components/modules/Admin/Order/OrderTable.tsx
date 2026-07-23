"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getAllOrders } from "@/services/order.services";
import { PaginationMeta } from "@/types/api.types";
import { IOrder } from "@/types/order.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { orderColumns } from "./orderColumns";
import ViewOrderDialog from "./ViewOrderDialog";
import UpdateStatusModal from "./UpdateStatusModal";
import DeleteOrderDialog from "./DeleteOrderDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const OrderTable = ({
  initialQueryString,
  orderType,
  emptyMessage,
  searchPlaceholder,
}: {
  initialQueryString: string;
  orderType?: "ONLINE" | "POS" | "LANDING_PAGE";
  emptyMessage?: string;
  searchPlaceholder?: string;
}) => {
  const searchParams = useSearchParams();
  const {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IOrder>();

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
    data: orderResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["orders", orderType, queryString],
    queryFn: () => {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      if (orderType) params.orderType = orderType;
      return getAllOrders(params);
    },
  });

  const orderList = orderResponse?.data ?? [];
  const meta: PaginationMeta | undefined = orderResponse?.meta;

  return (
    <>
      <DataTable
        data={orderList}
        columns={orderColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage={emptyMessage || "No orders found."}
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
          placeholder: searchPlaceholder || "Search orders (Order No, Name, Phone)...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        meta={meta}
        actions={tableActions}
      />

      <ViewOrderDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        order={viewingItem}
      />

      <UpdateStatusModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        order={editingItem}
      />

      <DeleteOrderDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        order={deletingItem}
      />
    </>
  );
};

export default OrderTable;

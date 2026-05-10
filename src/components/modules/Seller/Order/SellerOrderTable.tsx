"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getVendorOrders } from "@/services/order.services";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { sellerOrderColumns } from "./sellerOrderColumns";
import UpdateItemStatusModal from "./UpdateItemStatusModal";
import ViewOrderDialog from "../../Admin/Order/ViewOrderDialog";

const SellerOrderTable = () => {
  const searchParams = useSearchParams();
  const {
    viewingItem,
    editingItem,
    isViewDialogOpen,
    isEditModalOpen,
    onViewOpenChange,
    onEditOpenChange,
    tableActions,
  } = useRowActionModalState<any>();

  const { updateParams } = useServerManagedDataTable({
    searchParams,
    defaultPage: 1,
    defaultLimit: 10,
  });

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
    queryKey: ["vendor-orders", searchTermFromUrl],
    queryFn: () => getVendorOrders(),
  });

  const orderItemList = orderResponse?.data ?? [];

  return (
    <>
      <DataTable
        data={orderItemList}
        columns={sellerOrderColumns}
        isLoading={isLoading || isFetching}
        emptyMessage="No orders found for your products."
        search={{
          initialValue: searchTermFromUrl,
          placeholder: "Search ordered products...",
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        actions={tableActions}
      />

      {/* Reusing the Admin View Dialog but passing order object from item */}
      <ViewOrderDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        order={viewingItem?.order || null}
      />

      <UpdateItemStatusModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        item={editingItem}
      />
    </>
  );
};

export default SellerOrderTable;

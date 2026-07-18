"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getMyOrders, getOrderById, getVendorOrders } from "@/services/order.services";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { sellerOrderColumns } from "./sellerOrderColumns";
import UpdateItemStatusModal from "./UpdateItemStatusModal";
import ViewOrderDialog from "../../Admin/Order/ViewOrderDialog";

const SellerOrderTable = ({ orderType }: { orderType: "ONLINE" | "POS" }) => {
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
    queryKey: ["vendor-orders", orderType, searchTermFromUrl],
    queryFn: () => getVendorOrders(orderType),
  });

  const orderItemList = orderResponse?.data ?? [];

  // Fetch full order details when viewing
  const { data: fullOrderResponse, isLoading: isFullOrderLoading } = useQuery({
    queryKey: ["order", viewingItem?.orderId],
    queryFn: () => getOrderById(viewingItem?.orderId),
    enabled: !!viewingItem?.orderId && isViewDialogOpen,
  });

  const fullOrder = fullOrderResponse?.data;

  return (
    <>
      <DataTable
        data={orderItemList}
        columns={sellerOrderColumns}
        isLoading={isLoading || isFetching}
        emptyMessage={
          orderType === "POS"
            ? "No POS orders found yet."
            : "No online orders found for your products."
        }
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
        order={fullOrder || viewingItem?.order || null}
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

"use client";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDatatableSearch";
import { getShopCoupons } from "@/services/coupon.services";
import { getMyShop } from "@/services/shop.services";
import { PaginationMeta } from "@/types/api.types";
import { ICoupon } from "@/types/coupon.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import CreateCouponFormModal from "./CreateCouponFormModal";
import DeleteCouponConfirmationDialog from "./DeleteCouponConfirmationDialog";
import ViewCouponDialog from "./ViewCouponDialog";
import { couponColumns } from "./couponColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const CouponTable = ({
  initialQueryString,
}: {
  initialQueryString: string;
}) => {
  const searchParams = useSearchParams();
  const {
    viewingItem,
    deletingItem,
    isViewDialogOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<ICoupon>();

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

  // Fetch shop first
  const { data: myShop, isLoading: isLoadingShop } = useQuery({
    queryKey: ["myShop"],
    queryFn: getMyShop,
  });

  const {
    data: couponResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["coupons", queryString, myShop?.id],
    queryFn: () => {
      const params = Object.fromEntries(new URLSearchParams(queryString));
      return getShopCoupons(myShop!.id, params);
    },
    enabled: !!myShop?.id,
  });

  const couponList = couponResponse?.data ?? [];
  const meta: PaginationMeta | undefined = couponResponse?.meta;

  if (isLoadingShop) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading shop details...</span>
        </div>
      </div>
    );
  }

  if (!myShop) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center bg-muted/20">
        <h3 className="text-lg font-bold">No Shop Found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          You need to register a shop before you can manage coupons.
        </p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        data={couponList}
        columns={couponColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No coupons found in your shop."
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
          placeholder: "Search coupons by code...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        toolbarAction={<CreateCouponFormModal shopId={myShop.id} />}
        meta={meta}
        actions={tableActions}
      />

      <DeleteCouponConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        coupon={deletingItem}
      />

      <ViewCouponDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        coupon={viewingItem}
      />
    </>
  );
};

export default CouponTable;

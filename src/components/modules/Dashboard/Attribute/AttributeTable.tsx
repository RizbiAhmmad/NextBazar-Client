"use client";

import DataTable from "@/components/shared/table/DataTable";
import { getAllAttributes } from "@/services/attribute.services";
import { IAttribute } from "@/types/attribute.types";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CreateAttributeFormModal from "./CreateAttributeFormModal";
import DeleteAttributeConfirmationDialog from "./DeleteAttributeConfirmationDialog";
import EditAttributeFormModal from "./EditAttributeFormModal";
import { getAttributeColumns } from "./attributeColumns";

interface AttributeTableProps {
  createAction: (payload: { name: string; shopId?: string | null }) => Promise<any>;
  updateAction: (id: string, payload: { name: string }) => Promise<any>;
  deleteAction: (id: string) => Promise<any>;
}

const AttributeTable = ({
  createAction,
  updateAction,
  deleteAction,
}: AttributeTableProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Modals visibility & item state
  const [editingItem, setEditingItem] = useState<IAttribute | null>(null);
  const [deletingItem, setDeletingItem] = useState<IAttribute | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditTrigger = useCallback((item: IAttribute) => {
    setEditingItem(item);
    setIsEditOpen(true);
  }, []);

  const handleManageValuesTrigger = useCallback((item: IAttribute) => {
    const basePath = pathname.includes("/admin")
      ? "/admin/dashboard/attributes"
      : "/seller/dashboard/attributes";
    router.push(`${basePath}/${item.id}`);
  }, [pathname, router]);

  const handleDeleteTrigger = useCallback((item: IAttribute) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  }, []);

  const {
    data: attributeResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => getAllAttributes(),
  });

  const attributesList = attributeResponse?.data || [];

  const columns = getAttributeColumns(
    handleEditTrigger,
    handleManageValuesTrigger,
    handleDeleteTrigger
  );

  return (
    <>
      <DataTable
        data={attributesList}
        columns={columns}
        isLoading={isLoading || isFetching}
        emptyMessage="No attributes found."
        toolbarAction={<CreateAttributeFormModal createAction={createAction} />}
      />

      <EditAttributeFormModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        attribute={editingItem}
        updateAction={updateAction}
      />

      <DeleteAttributeConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        attribute={deletingItem}
        deleteAction={deleteAction}
      />
    </>
  );
};

export default AttributeTable;


"use client";

import { changeShopStatusAction } from "@/app/(dashboardLayout)/admin/dashboard/shops/_action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IShop } from "@/types/shop.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, MoreHorizontal, ShieldOff, Clock } from "lucide-react";
import { toast } from "sonner";

const ShopActions = ({ shop }: { shop: IShop }) => {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async (status: IShop["status"]) =>
      changeShopStatusAction(shop.id, status),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Shop status updated");
        queryClient.invalidateQueries({ queryKey: ["shops"] });
      } else {
        toast.error(result.message || "Failed to update shop status");
      }
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Shop Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {shop.status !== "ACTIVE" && (
          <DropdownMenuItem
            className="text-green-600 focus:text-green-600 focus:bg-green-50"
            onClick={() => updateStatus("ACTIVE")}
            disabled={isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Shop
          </DropdownMenuItem>
        )}

        {shop.status !== "PENDING" && (
          <DropdownMenuItem
            onClick={() => updateStatus("PENDING")}
            disabled={isPending}
          >
            <Clock className="mr-2 h-4 w-4" />
            Set Pending
          </DropdownMenuItem>
        )}

        {shop.status !== "BLOCKED" && (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => updateStatus("BLOCKED")}
            disabled={isPending}
          >
            <ShieldOff className="mr-2 h-4 w-4" />
            Block Shop
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShopActions;

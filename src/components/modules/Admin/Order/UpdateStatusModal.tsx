"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrder, OrderStatus } from "@/types/order.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/services/order.services";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface UpdateStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function UpdateStatusModal({
  open,
  onOpenChange,
  order,
}: UpdateStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order?.orderStatus || "PENDING");
  const [loading, setLoading] = useState(false);

  // Update status when order changes
  if (order && status !== order.orderStatus && !loading) {
    // This is a simple way to sync, but better to use useEffect or handle it in parent
  }

  const handleUpdate = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await updateOrderStatus(order.id, status);
      if (res.success) {
        toast.success("Order status updated successfully");
        onOpenChange(false);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight">Update Order Status</DialogTitle>
          <DialogDescription>
            Change the current fulfillment status of the selected order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Current Status: <span className="font-bold">{order.orderStatus}</span></Label>
            <Select
              defaultValue={order.orderStatus}
              onValueChange={(value) => setStatus(value as OrderStatus)}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl font-bold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl font-bold"
              onClick={handleUpdate}
              disabled={loading || status === order.orderStatus}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderItemStatus } from "@/services/order.services";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface UpdateItemStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any | null;
}

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function UpdateItemStatusModal({
  open,
  onOpenChange,
  item,
}: UpdateItemStatusModalProps) {
  const [status, setStatus] = useState<string>(item?.status || "PENDING");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!item) return;
    setLoading(true);
    try {
      const res = await updateOrderItemStatus(item.id, status);
      if (res.success) {
        toast.success("Item status updated successfully");
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

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            Update Fulfillment Status
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Updating status for: {item.product?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>
              Current Status: <span className="font-bold">{item.status}</span>
            </Label>
            <Select
              defaultValue={item.status}
              onValueChange={(value) => setStatus(value)}
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
              disabled={loading || status === item.status}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

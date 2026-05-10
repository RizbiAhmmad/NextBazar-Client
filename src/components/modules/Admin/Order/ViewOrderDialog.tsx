"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrder } from "@/types/order.types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReviewModal from "../../User/Review/ReviewModal";

interface ViewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder | null;
}

export default function ViewOrderDialog({
  open,
  onOpenChange,
  order,
}: ViewOrderDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (!order) return null;

  const handleReviewClick = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setIsReviewModalOpen(true);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Order Details</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Order ID: {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer & Status Info */}
          <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-2xl">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Customer</p>
              <p className="font-bold">{order.fullName}</p>
              <p className="text-sm">{order.phone}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase">Date</p>
              <p className="font-bold">{format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}</p>
              <div className="flex justify-end gap-2 mt-1">
                <Badge variant="outline">{order.orderStatus}</Badge>
                <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2">
            <h3 className="font-black text-lg">Shipping Address</h3>
            <div className="text-sm leading-relaxed text-muted-foreground bg-card p-4 rounded-xl border">
              {order.address}, {order.district}
              {order.notes && (
                <>
                  <Separator className="my-2" />
                  <span className="block italic">Note: {order.notes}</span>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-black text-lg">Order Items ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-card p-3 rounded-xl border">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border">
                    <Image
                      src={item.product?.images?.[0] || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-black text-sm">৳{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">৳{item.price.toFixed(2)} each</p>
                    {order.orderStatus === "DELIVERED" && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary font-bold text-xs"
                        onClick={() => handleReviewClick(item.productId, item.product?.name || "Product")}
                      >
                        Write a Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">৳{(order.totalAmount - 60).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-bold">৳60.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-black">Total</span>
              <span className="text-xl font-black text-primary">৳{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>

      {selectedProduct && (
        <ReviewModal
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}
    </Dialog>
  );
}

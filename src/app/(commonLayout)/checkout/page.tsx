/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "@/providers/CartProvider";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createOrder } from "@/services/order.services";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function CheckoutContent() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Direct Buy State
  const [directItem, setDirectItem] = useState<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    variantId?: string;
    variantName?: string;
  } | null>(null);

  useEffect(() => {
    const productId = searchParams.get("productId");
    const quantity = searchParams.get("quantity");
    const name = searchParams.get("name");
    const price = searchParams.get("price");
    const variantId = searchParams.get("variantId") || undefined;
    const variantName = searchParams.get("variantName") || undefined;

    if (productId && quantity && name && price) {
      const timer = setTimeout(() => {
        setDirectItem({
          id: productId,
          name: name,
          price: Number(price),
          quantity: Number(quantity),
          variantId,
          variantName,
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const subtotal = directItem
    ? directItem.price * directItem.quantity
    : cartItems.reduce(
        (total, item) => total + (item.variant?.sellPrice || item.sellPrice) * item.cartQuantity,
        0,
      );

  const itemsCount = directItem ? directItem.quantity : cartItems.length;
  const shipping = itemsCount > 0 ? 60 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!directItem && cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload: any = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      district: formData.get("district") as string,
      address: formData.get("address") as string,
      notes: formData.get("notes") as string,
    };

    // If it's a direct buy, send the items explicitly
    if (directItem) {
      payload.items = [
        {
          productId: directItem.id,
          quantity: directItem.quantity,
          productVariantId: directItem.variantId || undefined,
        },
      ];
    }

    setIsLoading(true);
    try {
      const res = await createOrder(payload);
      if (res.success) {
        toast.success("Order placed successfully!");
        if (!directItem) clearCart();
        setIsSuccess(true);
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <CheckCircle2 className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Thank you for shopping with NextBazar. Your order has been placed and
          is being processed.
        </p>
        <Button asChild size="lg" className="rounded-full h-12 px-8 font-bold">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (!directItem && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          You have no items to checkout.
        </p>
        <Button asChild onClick={() => router.push("/products")}>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <h1 className="text-3xl lg:text-4xl font-black mb-10 tracking-tight">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Checkout Form */}
        <div className="flex-1">
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="01XXX-XXXXXX"
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District/City</Label>
                <Input
                  id="district"
                  name="district"
                  placeholder="Dhaka"
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="House No, Road No, Area"
                  required
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any special instructions for delivery..."
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-card rounded-3xl p-8 shadow-sm border sticky top-28">
            <h2 className="text-xl font-black mb-6">Your Order</h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {directItem ? (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex-1 pr-4">
                    <p className="font-medium line-clamp-1 flex flex-wrap gap-2 items-center">
                      {directItem.name}
                      {directItem.variantName && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {directItem.variantName}
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      Qty: {directItem.quantity}
                    </p>
                  </div>
                  <div className="font-bold">
                    ৳{(directItem.price * directItem.quantity).toFixed(2)}
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.productVariantId || "base"}`}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex-1 pr-4">
                      <p className="font-medium line-clamp-1 flex flex-wrap gap-2 items-center">
                        {item.name}
                        {item.variant?.combination && (
                          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {item.variant.combination}
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground">
                        Qty: {item.cartQuantity}
                      </p>
                    </div>
                    <div className="font-bold">
                      ৳{((item.variant?.sellPrice || item.sellPrice) * item.cartQuantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">
                  Subtotal
                </span>
                <span className="font-bold">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">
                  Shipping Estimate
                </span>
                <span className="font-bold">৳{shipping.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between mb-8">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-black text-primary">
                ৳{total.toFixed(2)}
              </span>
            </div>

            <div className="bg-muted p-4 rounded-xl mb-6 text-sm text-center font-medium">
              Payment Method: Cash on Delivery
            </div>

            <Button
              type="submit"
              form="checkout-form"
              className="w-full h-14 rounded-full text-lg font-bold group"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Place Order"}
              {!isLoading && (
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

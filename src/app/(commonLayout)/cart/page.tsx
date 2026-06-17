"use client";

import { useCart } from "@/providers/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.sellPrice * item.cartQuantity,
    0,
  );

  const shipping = cartItems.length > 0 ? 60 : 0; // Flat ৳60 shipping
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-primary/5 p-6 rounded-full mb-6">
          <ShoppingBag className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Discover
          our amazing products and start shopping!
        </p>
        <Button asChild size="lg" className="rounded-full h-12 px-8 font-bold">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <h1 className="text-3xl lg:text-4xl font-black mb-10 tracking-tight">
        Shopping Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-card rounded-3xl p-6 shadow-sm border">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-bold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-1 text-right"></div>
            </div>

            <div className="divide-y divide-border">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center"
                >
                  <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                      <div className="flex flex-col gap-1">
                      <Link
                        href={`/products/${item.id}`}
                        className="font-bold text-lg hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-muted-foreground bg-muted w-max px-2 py-1 rounded-md">
                          {item.category?.name || "Uncategorized"}
                        </span>
                        {item.variant?.combination && (
                          <span className="text-xs text-primary bg-primary/10 w-max px-2 py-1 rounded-md font-semibold">
                            {item.variant.combination}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 text-center font-bold text-lg">
                    ৳{item.sellPrice.toFixed(2)}
                  </div>

                  <div className="col-span-1 sm:col-span-3 flex justify-center">
                    <div className="flex items-center border rounded-full overflow-hidden bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none hover:bg-muted/50 hover:text-primary"
                        onClick={() => {
                          if (item.cartQuantity > 1) {
                            updateQuantity(item.id, item.cartQuantity - 1, item.productVariantId);
                          } else {
                            removeFromCart(item.id, item.productVariantId);
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-10 text-center font-bold text-sm">
                        {item.cartQuantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none hover:bg-muted/50 hover:text-primary"
                        disabled={item.cartQuantity >= item.stock}
                        onClick={() =>
                          updateQuantity(item.id, item.cartQuantity + 1, item.productVariantId)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                      onClick={() => removeFromCart(item.id, item.productVariantId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-card rounded-3xl p-8 shadow-sm border sticky top-28">
            <h2 className="text-xl font-black mb-6">Order Summary</h2>

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

            <Button asChild className="w-full h-14 rounded-full text-lg font-bold group">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <div className="mt-6 text-center">
              <Link
                href="/products"
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

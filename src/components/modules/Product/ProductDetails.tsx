/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Package,
  ShieldCheck,
  Truck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/CartProvider";
import { useRouter } from "next/navigation";
import ProductReviews from "./ProductReviews";

interface ProductDetailsProps {
  product: IProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : null,
  );
  const [quantity, setQuantity] = useState(1);

  const discount =
    product.regularPrice > product.sellPrice
      ? Math.round(
          ((product.regularPrice - product.sellPrice) / product.regularPrice) *
            100,
        )
      : 0;

  return (
    <div className="bg-background pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border border-border/50">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-white text-base px-3 py-1">
                  {discount}% OFF
                </Badge>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? "border-primary shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.category?.name || "Uncategorized"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <Badge
                variant={product.stock > 0 ? "default" : "secondary"}
                className={
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    : ""
                }
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
              {product.stock > 0 && (
                <span className="text-sm text-muted-foreground font-medium">
                  {product.stock} items available
                </span>
              )}
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-black text-slate-900">
                ৳{product.sellPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  ৳{product.regularPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-sm font-semibold text-slate-700">Quantity</span>
              <div className="flex items-center border rounded-full overflow-hidden bg-background">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-none h-10 w-10 hover:bg-muted/50 hover:text-primary"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock === 0}
                >
                  <span className="text-lg font-bold">-</span>
                </Button>
                <div className="w-12 text-center font-bold text-sm">
                  {quantity}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-none h-10 w-10 hover:bg-muted/50 hover:text-primary"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  <span className="text-lg font-bold">+</span>
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                className="flex-1 rounded-full text-lg h-14 bg-slate-900 hover:bg-slate-800"
                disabled={product.stock === 0}
                onClick={() => addToCart(product, quantity)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 rounded-full text-lg h-14"
                disabled={product.stock === 0}
                onClick={() => {
                  router.push(`/checkout?productId=${product.id}&quantity=${quantity}&name=${encodeURIComponent(product.name)}&price=${product.sellPrice}`);
                }}
              >
                <Zap className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-14 w-full sm:w-14 px-0"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>

            <Separator className="mb-8" />

            {/* Features/Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <Truck className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  Fast Delivery
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Across the country
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  Secure Payment
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  100% safe transactions
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl">
                <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  Easy Returns
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  7-day return policy
                </p>
              </div>
            </div>

            {/* Full Description */}
            <div className="mt-8 mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-tight">
                Product Description
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {(product as any).description || product.shortDescription}
                </p>
              </div>
            </div>

            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

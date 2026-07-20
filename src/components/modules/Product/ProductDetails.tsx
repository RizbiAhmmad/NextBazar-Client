/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CategoryRecommendations from "./CategoryRecommendations";
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
import { useWishlist } from "@/providers/WishlistProvider";
import { useRouter } from "next/navigation";
import ProductReviews from "./ProductReviews";

interface ProductDetailsProps {
  product: IProduct;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Normalize all image URLs (handle relative paths from local server)
  const formatImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:5000"}/${url}`;
  };

  // Collect product images + variant images (deduplicated)
  const productImages = (product.images || []).map(formatImageUrl).filter(Boolean);
  const variantImages = (product.variants || [])
    .map((v: any) => (v.image ? formatImageUrl(v.image) : null))
    .filter(Boolean) as string[];

  const allImages = Array.from(new Set([...productImages, ...variantImages]));

  console.log("[ProductDetails] product.variants:", product.variants);
  console.log("[ProductDetails] allImages:", allImages);

  const [activeImage, setActiveImage] = useState<string | null>(
    allImages.length > 0 ? allImages[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariant, setCurrentVariant] = useState<any>(null);

  useEffect(() => {
    if (product.type !== "VARIABLE" || !product.attributes || !product.variants) return;

    const attrs = product.attributes as any[];
    const comboArray = attrs.map((attr: any) => selectedOptions[attr.name]);
    const allSelected = comboArray.every((val) => val !== undefined && val !== "");

    if (!allSelected) {
      setCurrentVariant(null);
      return;
    }

    const comboString = comboArray.join("-");
    console.log("[ProductDetails] Looking for combination:", comboString);
    console.log("[ProductDetails] Available variants:", product.variants.map((v: any) => v.combination));

    const matched = (product.variants as any[]).find(
      (v) => v.combination.toLowerCase().trim() === comboString.toLowerCase().trim()
    );

    setCurrentVariant(matched || null);

    if (matched) {
      if (matched.image) {
        setActiveImage(formatImageUrl(matched.image));
      } else {
        // No variant image — fall back to first product image
        setActiveImage(allImages[0] ?? null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  const displaySellPrice = currentVariant ? currentVariant.sellPrice : product.sellPrice;
  const displayRegularPrice = currentVariant ? currentVariant.regularPrice : product.regularPrice;
  // NOTE: ProductVariant uses 'quantity' field (not 'stock')
  const displayStock =
    currentVariant != null
      ? (currentVariant.quantity ?? currentVariant.stock ?? 0)
      : product.stock;

  const discount =
    displayRegularPrice > displaySellPrice
      ? Math.round(
        ((displayRegularPrice - displaySellPrice) / displayRegularPrice) *
        100,
      )
      : 0;

  const isAddToCartDisabled = displayStock === 0 || (product.type === "VARIABLE" && !currentVariant);

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

            {allImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img
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

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <Badge
                variant={displayStock > 0 ? "default" : "secondary"}
                className={
                  displayStock > 0
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                    : ""
                }
              >
                {displayStock > 0 ? "In Stock" : "Out of Stock"}
              </Badge>
              {displayStock > 0 && (
                <span className="text-sm text-muted-foreground font-medium">
                  {displayStock} items available
                </span>
              )}
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-black text-slate-900">
                ৳{displaySellPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  ৳{displayRegularPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div
              className="text-lg text-slate-600 mb-8 leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>strong]:font-bold [&>a]:text-primary [&>a]:underline"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />


            {/* Variable Product Options */}
            {product.type === "VARIABLE" && product.attributes && (
              <div className="mb-8 space-y-6 border-y py-6">
                {product.attributes.map((attr: any) => (
                  <div key={attr.name} className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                      {attr.name}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {attr.values.map((val: string) => {
                        const isSelected = selectedOptions[attr.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => {
                              const newOptions = { ...selectedOptions, [attr.name]: val };
                              setSelectedOptions(newOptions);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-md"
                              : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-slate-50"
                              }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 mb-8">
              <span className="text-sm font-semibold text-slate-700">
                Quantity
              </span>
              <div className="flex items-center border rounded-full overflow-hidden bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none h-10 w-10 hover:bg-muted/50 hover:text-primary"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || displayStock === 0}
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
                  onClick={() =>
                    setQuantity((q) => Math.min(displayStock, q + 1))
                  }
                  disabled={quantity >= displayStock || displayStock === 0}
                >
                  <span className="text-lg font-bold">+</span>
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {displayStock > 0
                  ? `${displayStock} available`
                  : "Out of stock"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                className="flex-1 rounded-full text-lg h-14 bg-slate-900 hover:bg-slate-800"
                disabled={isAddToCartDisabled}
                onClick={() => addToCart(product, quantity, currentVariant?.id)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 rounded-full text-lg h-14"
                disabled={isAddToCartDisabled}
                onClick={() => {
                  router.push(
                    `/checkout?productId=${product.id}&quantity=${quantity}&name=${encodeURIComponent(product.name)}&price=${displaySellPrice}&variantId=${currentVariant?.id || ""}&variantName=${currentVariant ? encodeURIComponent(currentVariant.combination) : ""}&image=${encodeURIComponent(activeImage || "")}`,
                  );
                }}
              >
                <Zap className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`rounded-full h-14 w-full sm:w-14 px-0 ${inWishlist ? "text-primary border-primary bg-primary/5" : ""}`}
                onClick={() => {
                  if (inWishlist) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
              >
                <Heart className="h-5 w-5" fill={inWishlist ? "currentColor" : "none"} />
                <span className="sr-only">{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
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
          </div>
        </div>

        {/* Separated Bottom Section: Description / Reviews & Recommendations */}
        <div className="mt-16 text-left w-full">
          {/* Description / Reviews Toggle */}
          <div className="mb-6">
            <div className="flex gap-2 mb-6 border-b pb-0">
              <button
                className={`px-6 py-3 font-semibold focus:outline-none transition-colors border-b-2 ${showDescription ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                onClick={() => setShowDescription(true)}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 font-semibold focus:outline-none transition-colors border-b-2 ${!showDescription ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                onClick={() => setShowDescription(false)}
              >
                Reviews
              </button>
            </div>

            {/* Description Content */}
            {showDescription && (
              <div className="mt-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                  Product Description
                </h3>
                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>p]:mb-3 [&>strong]:font-bold"
                  dangerouslySetInnerHTML={{
                    __html:
                      (product as any).description ||
                      product.shortDescription,
                  }}
                />
              </div>
            )}
          </div>

          {/* Product Reviews */}
          {!showDescription && (
            <div className="mt-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <ProductReviews productId={product.id} />
            </div>
          )}

          {/* Category Recommendations */}
          <div className="mt-16">
            {product.category?.id && (
              <CategoryRecommendations
                categoryId={product.category.id}
                currentProductId={product.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

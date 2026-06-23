"use client";

import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.regularPrice > product.sellPrice
      ? Math.round(
          ((product.regularPrice - product.sellPrice) / product.regularPrice) *
            100,
        )
      : 0;

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <Card className="group relative overflow-hidden rounded-2xl border-none bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square w-full p-2 overflow-hidden">
          <div className="relative h-full w-full rounded-2xl overflow-hidden bg-muted/50 dark:bg-slate-800">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-destructive/90 text-white font-semibold shadow-sm">
                -{discount}%
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm shadow-sm"
              >
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="line-clamp-2 text-base font-bold group-hover:text-primary transition-colors flex-1">
            {product.name}
          </h3>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-black text-primary leading-none">
                ৳{product.sellPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-muted-foreground line-through leading-none">
                  ৳{product.regularPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-muted/50 w-full">
            <Button
              variant="default"
              className="w-full text-xs font-bold rounded-xl h-9 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:bg-primary/90"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

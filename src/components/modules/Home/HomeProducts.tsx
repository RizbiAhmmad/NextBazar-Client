"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/product.services";
import ProductCard from "./ProductCard";
import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["homeProducts"],
    queryFn: () => getAllProducts({ limit: "8" }), // fetch 8 products for home page
  });

  const products: IProduct[] = data?.data || [];

  return (
    <section className="py-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Trending Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover the most popular items across our marketplace.
          </p>
        </div>
        <Link href="/products" className="hidden sm:block">
          <Button
            variant="ghost"
            className="font-semibold text-primary hover:bg-primary/5"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
          <p className="text-muted-foreground text-lg">
            No products available right now. Check back later!
          </p>
        </div>
      )}

      <div className="mt-10 text-center sm:hidden">
        <Link href="/products">
          <Button variant="outline" className="w-full">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/product.services";
import ProductCard from "./ProductCard";
import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

export default function HomeProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["homeProducts"],
    queryFn: () => getAllProducts({ limit: "8" }), // fetch 8 products for home page
    staleTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const products: IProduct[] = data?.data || [];

  return (
    <section className="py-10">
      <div className="flex items-end justify-between gap-4 mb-10">
        <SectionHeading
          align="left"
          eyebrow="Trending Now"
          title="Trending Products"
          subtitle="Discover the most popular items across our marketplace."
        />
        <Link href="/products" className="hidden sm:block shrink-0">
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

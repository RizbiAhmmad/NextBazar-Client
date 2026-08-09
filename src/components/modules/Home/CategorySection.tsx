/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category.services";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";

export default function CategorySection() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    staleTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const categories = data?.data?.filter((c: any) => c.isActive !== false) || [];

  return (
    <section className="py-10 bg-slate-50/50 rounded-[2.5rem] px-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8">
        <SectionHeading
          align="left"
          eyebrow="Categories"
          title="Browse by Category"
          className="text-left"
        />
        <Link href="/products">
          <Button
            variant="ghost"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5"
          >
            Explore All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-24 sm:w-28 md:w-32 lg:w-36 rounded-2xl" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {categories.slice(0, 12).map((category: any) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="group w-24 sm:w-28 md:w-32 lg:w-36"
            >
              <Card className="border-none bg-white shadow-sm ring-1 ring-black/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden py-0 gap-0">
                <CardContent className="p-0">
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <Image
                      src={category.image || "/placeholder.png"}
                      alt={category.name}
                      fill
                      sizes="144px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </section>
  );
}

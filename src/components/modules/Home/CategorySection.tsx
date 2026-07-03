/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category.services";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, LayoutGrid } from "lucide-react";

export default function CategorySection() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
    staleTime: 10 * 60 * 1000, // cache for 10 minutes
  });

  const categories = data?.data?.filter((c: any) => c.isActive !== false) || [];

  return (
    <section className="py-8 bg-slate-50/50 rounded-[3rem] px-6 my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Browse Categories
          </h2>
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {categories.slice(0, 10).map((category: any) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="group w-full max-w-[160px]"
            >
              <Card className="border-none bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl overflow-hidden h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square w-full p-2">
                    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <Image
                        src={category.image || "/placeholder.png"}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="p-3 pt-0 pb-4 text-center">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground dark:text-slate-500 uppercase font-black tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Explore
                    </p>
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

// Just adding Button here because it's used in the template but not imported as a specific component sometimes if I forget
import { Button } from "@/components/ui/button";

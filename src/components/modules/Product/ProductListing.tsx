/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/product.services";
import { getAllCategories } from "@/services/category.services";
import ProductCard from "@/components/modules/Home/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (ids: string[]) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  handleFilterChange: () => void;
  clearFilters: () => void;
}

const FilterSidebar = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleFilterChange,
  clearFilters,
}: FilterSidebarProps) => {
  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight mb-4 dark:text-white">
          Categories
        </h3>
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
          {categories.map((cat: any) => (
            <div key={cat.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={cat.id}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
                className="rounded-md border-2 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={cat.id}
                className="text-sm font-bold text-muted-foreground dark:text-slate-400 group-hover:text-primary cursor-pointer transition-colors"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black uppercase tracking-tight mb-4 dark:text-white">
          Price Range
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                ৳
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-xl h-11 pl-7 font-bold border-muted/50 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus-visible:ring-primary"
              />
            </div>
            <span className="text-muted-foreground font-black">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                ৳
              </span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-xl h-11 pl-7 font-bold border-muted/50 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button
          className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          onClick={handleFilterChange}
        >
          Apply Filters
        </Button>

        <Button
          variant="ghost"
          className="w-full text-xs font-bold text-muted-foreground dark:text-slate-500 hover:text-destructive transition-colors"
          onClick={clearFilters}
        >
          <X className="mr-2 h-4 w-4" /> Reset All
        </Button>
      </div>
    </div>
  );
};

function ProductListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for filters - Initialized from URL
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || "",
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const initialCategories = searchParams.get("categoryId")
    ? searchParams.get("categoryId")!.split(",")
    : [];
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);

  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  // Fetch categories
  const { data: categoryResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  // Fetch products based on current params
  const {
    data: productResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", searchParams.toString()],
    queryFn: () => {
      const params: any = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return getAllProducts(params);
    },
  });

  const handleFilterChange = (newSortBy?: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (selectedCategories.length > 0) {
      params.set("categoryId", selectedCategories.join(","));
    }
    params.set("sortBy", newSortBy || sortBy);

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSortBy("newest");
    router.push("/products");
  };

  const products = productResponse?.data || [];
  const categories = categoryResponse?.data || [];

  const filterProps = {
    categories,
    selectedCategories,
    setSelectedCategories,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    handleFilterChange,
    clearFilters,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar {...filterProps} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 dark:bg-slate-900/50 p-4 rounded-3xl border border-muted/50 dark:border-slate-800 backdrop-blur-sm">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 h-12 rounded-2xl bg-background dark:bg-slate-900 border-none shadow-sm focus-visible:ring-primary transition-all dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFilterChange()}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden h-12 rounded-2xl shrink-0 font-bold border-muted/50 dark:border-slate-800 dark:text-white"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] dark:bg-slate-950 dark:border-slate-800">
                  <div className="py-6">
                    <FilterSidebar {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={sortBy}
                onValueChange={(val) => {
                  setSortBy(val);
                  handleFilterChange(val);
                }}
              >
                <SelectTrigger className="h-12 rounded-2xl w-full md:w-[200px] bg-background dark:bg-slate-900 shadow-sm border-none font-bold dark:text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="newest" className="font-medium">
                    Newest First
                  </SelectItem>
                  <SelectItem value="price_asc" className="font-medium">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price_desc" className="font-medium">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="popularity" className="font-medium">
                    Most Popular
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-widest">
              {isLoading ? "Searching..." : `Found ${products.length} products`}
            </p>
          </div>

          {/* Product Grid */}
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-4 bg-muted/10 p-4 rounded-3xl border border-muted/20"
                >
                  <Skeleton className="aspect-square w-full rounded-2xl bg-muted/20" />
                  <Skeleton className="h-6 w-3/4 rounded-lg bg-muted/20" />
                  <Skeleton className="h-10 w-full rounded-xl bg-muted/20" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted/30">
              <div className="h-20 w-20 bg-muted/20 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                We couldn&apos;t find anything matching your search. Try
                adjusting your filters.
              </p>
              <Button
                variant="link"
                onClick={clearFilters}
                className="mt-6 font-black text-primary uppercase tracking-widest text-xs"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductListing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductListingWrapper />
    </Suspense>
  );
}

function ProductListingWrapper() {
  const searchParams = useSearchParams();
  // Using the searchParams as a key forces the component to reset whenever the URL changes
  // This is the recommended "React way" to sync state from the URL without using useEffect
  return <ProductListingContent key={searchParams.toString()} />;
}

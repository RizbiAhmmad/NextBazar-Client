"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/product.services";
import ProductCard from "./ProductCard";
import { IProduct } from "@/components/modules/Seller/Product/productColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function FlashSale() {
  const { data, isLoading } = useQuery({
    queryKey: ["flashSaleProducts"],
    queryFn: () => getAllProducts({ limit: "4" }), // fetch 4 products for flash sale
    staleTime: 10 * 60 * 1000,
  });

  const products: IProduct[] = data?.data || [];

  // Fake countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8">
      <div className="bg-purple-500 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-100 font-semibold bg-rose-600/50 w-fit px-3 py-1 rounded-full text-sm">
              <Zap className="w-4 h-4 text-yellow-300" fill="currentColor" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Flash Sale
            </h2>
            <p className="text-rose-100 text-lg max-w-xl">
              Grab these amazing deals before they are gone forever. Exclusive discounts up to 50% off!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
            <Clock className="w-5 h-5 text-rose-200" />
            <div className="flex items-center gap-2 font-mono text-xl md:text-2xl font-bold">
              <div className="bg-white text-rose-600 px-3 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="text-rose-200">:</span>
              <div className="bg-white text-rose-600 px-3 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="text-rose-200">:</span>
              <div className="bg-white text-rose-600 px-3 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <Skeleton className="h-48 w-full rounded-xl bg-white/20" />
                <Skeleton className="h-4 w-2/3 bg-white/20" />
                <Skeleton className="h-4 w-1/2 bg-white/20" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/10 rounded-2xl border border-white/20 border-dashed relative z-10">
            <p className="text-rose-100 text-lg">
              Flash sale ended! Stay tuned for the next one.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

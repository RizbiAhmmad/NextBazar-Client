/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getHeroSliders } from "@/services/heroSlider.services";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await getHeroSliders();
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (error) {
        console.error("Failed to load hero sliders:", error);
      }
    };
    fetchSliders();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full aspect-2/1 md:aspect-3/1 lg:aspect-3.5/1 overflow-hidden rounded-[2.5rem] bg-muted animate-pulse"></div>
    );
  }

  return (
    <section className="relative w-full aspect-2/1 md:aspect-3/1 lg:aspect-3.5/1 overflow-hidden rounded-[2.5rem]">
      <div
        className="flex h-full transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative h-full">
            <Image
              src={slide.image}
              alt={`Slide ${slide.id}`}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() =>
          setCurrent((current - 1 + slides.length) % slides.length)
        }
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm ring-1 ring-black/5 shadow-md p-2.5 rounded-full text-foreground hover:bg-background hover:scale-105 transition-all"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm ring-1 ring-black/5 shadow-md p-2.5 rounded-full text-foreground hover:bg-background hover:scale-105 transition-all"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              current === i ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

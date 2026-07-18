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
      <div className="relative h-62.5 w-full overflow-hidden rounded-2xl md:h-100 lg:h-125 bg-muted animate-pulse"></div>
    );
  }

  return (
    <section className="relative w-full aspect-2/1 md:aspect-3/1 lg:aspect-3.5/1 overflow-hidden rounded-2xl">
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
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-3 w-3 rounded-full transition ${
              current === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

import HeroCarousel from "@/components/modules/Home/HeroCarousel";
import HomeProducts from "@/components/modules/Home/HomeProducts";
import CategorySection from "@/components/modules/Home/CategorySection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="w-full max-w-8xl mx-auto p-4 md:p-6 lg:p-8">
        <HeroCarousel />
        <CategorySection />
        <HomeProducts />
      </main>
    </div>
  );
}

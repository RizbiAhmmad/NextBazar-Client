import HeroCarousel from "@/components/modules/Home/HeroCarousel";
import HomeProducts from "@/components/modules/Home/HomeProducts";
import CategorySection from "@/components/modules/Home/CategorySection";
import Features from "@/components/modules/Home/Features";
import MarketplaceStats from "@/components/modules/Home/MarketplaceStats";
import Testimonials from "@/components/modules/Home/Testimonials";
import FaqSection from "@/components/modules/Home/FaqSection";
import BecomeSellerCTA from "@/components/modules/Home/BecomeSellerCTA";
import Newsletter from "@/components/modules/Home/Newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <main className="w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 space-y-12 md:space-y-20 lg:space-y-32">
        <HeroCarousel />
        <CategorySection />
        <HomeProducts />
        <Features />
        <MarketplaceStats />
        <BecomeSellerCTA />
        <Testimonials />
        <FaqSection />
        <Newsletter />
      </main>
    </div>
  );
}

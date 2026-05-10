import { Button } from "@/components/ui/button";
import { Store, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Reach millions of customers",
  "Lowest commission rates",
  "Intuitive vendor dashboard",
  "Secure and fast payments",
];

export default function BecomeSellerCTA() {
  return (
    <section className="py-8">
      <div className="relative rounded-[4rem] bg-primary overflow-hidden p-8 md:p-16 lg:p-24 shadow-2xl shadow-primary/30">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
              <Store className="h-5 w-5 text-white" />
              <span className="text-white font-black text-xs uppercase tracking-widest">
                Partner with us
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Start Your Online Business Today
            </h2>

            <p className="text-primary-foreground/80 text-xl font-medium leading-relaxed max-w-xl">
              Join thousands of successful sellers who have grown their brands
              with NextBazar. We provide the tools, you provide the products.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-white font-bold"
                >
                  <CheckCircle2 className="h-5 w-5 text-white/60" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-50 rounded-2xl h-16 px-10 text-lg font-black shadow-xl shadow-black/10"
                asChild
              >
                <Link href="/become-seller">
                  Create Your Shop <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-2xl h-16 px-10 text-lg font-black"
              >
                Seller Guide
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-600 rounded-[3rem] rotate-3 translate-x-4 translate-y-4 -z-10 opacity-30" />
            <div className="relative aspect-square rounded-[3rem] bg-white p-8 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-slate-50 transition-colors group-hover:bg-slate-100/50" />
              <div className="relative z-10 flex flex-col h-full items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-4">
                  <Store className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">
                  NextBazar Seller
                </h3>
                <p className="text-slate-500 font-bold max-w-xs">
                  Everything you need to manage your inventory, sales, and
                  customers in one place.
                </p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
                </div>
                <p className="text-xs font-black text-primary uppercase tracking-widest">
                  Active Shops Growth: +45% This Month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import {
  Store,
  PackagePlus,
  ClipboardList,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  {
    title: "Register Your Shop",
    description:
      "Click 'Become a Seller', fill in your shop and business details, and submit for verification.",
    icon: Store,
  },
  {
    title: "Add Your Products",
    description:
      "List products with photos, pricing, and stock from your seller dashboard — as many or as few as you like.",
    icon: PackagePlus,
  },
  {
    title: "Manage Your Orders",
    description:
      "Track incoming orders in real time and update fulfillment status as you pack and ship each one.",
    icon: ClipboardList,
  },
  {
    title: "Get Paid",
    description:
      "Earnings from every sale are tracked automatically in your dashboard, ready for payout.",
    icon: Wallet,
  },
];

const faqs = [
  {
    question: "How much does it cost to start selling?",
    answer:
      "Creating a shop on NextBazar is free. We only take a small commission on completed sales — there are no upfront listing fees.",
  },
  {
    question: "How long does verification take?",
    answer:
      "Most shops are reviewed and approved within 1-2 business days after submitting your business details.",
  },
  {
    question: "Can I sell more than one type of product?",
    answer:
      "Yes — you can list products across any category your shop is approved for, and organize them with your own product categories.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Your vendor dashboard tracks earnings per order as they're fulfilled. Reach out to support to arrange a payout once your balance is ready.",
  },
];

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="container mx-auto px-6 relative z-10 max-w-3xl">
          <SectionHeading
            align="left"
            eyebrow="Seller Guide"
            title="Everything You Need To Start Selling"
            subtitle="A quick walkthrough of how to open your shop, list products, and start getting orders on NextBazar."
          />
          <Button size="lg" className="mt-8 h-14 px-8 rounded-2xl font-bold text-base" asChild>
            <Link href="/become-seller">
              Create Your Shop <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <SectionHeading eyebrow="How It Works" title="Four Simple Steps" className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow duration-300"
              >
                <span className="absolute top-6 right-6 text-4xl font-serif font-bold text-primary/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller FAQ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <SectionHeading eyebrow="Seller FAQ" title="Common Questions" className="mb-14" />
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-slate-100 dark:border-slate-800 rounded-2xl px-6 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline py-6 font-bold text-slate-800 dark:text-slate-100 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 dark:text-slate-400 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="rounded-[2.5rem] bg-primary p-10 md:p-16 text-center space-y-6 shadow-2xl shadow-primary/30">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
              Ready to open your shop?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Join thousands of sellers already growing their business on NextBazar.
            </p>
            <Button
              size="lg"
              className="h-14 px-8 rounded-2xl font-bold text-base bg-white text-primary hover:bg-slate-50"
              asChild
            >
              <Link href="/become-seller">
                Create Your Shop <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Scale, Shield, Key, ArrowRight, FileText, ExternalLink, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const tldrPoints = [
  {
    title: "Account Security",
    description: "You are responsible for safeguarding your account details. Any abuse will lead to termination.",
    icon: Key,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Transactions",
    description: "Payments are processed securely. NextBazar acts as a platform facilitating buyer-seller transactions.",
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Platform Rules",
    description: "We forbid spamming, listing illegal goods, and copyright violations. Fair play is mandatory.",
    icon: Scale,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
];

const termSections = [
  {
    id: "introduction",
    title: "1. Agreement to Terms",
    content: "Welcome to NextBazar. By accessing our platform, website, or using our services, you agree to comply with and be bound by these Terms of Service. Please read them carefully. If you do not agree to all of these terms, you are prohibited from using the platform and must discontinue use immediately.",
    details: "These terms constitute a legally binding agreement between you, whether personally or on behalf of an entity, and NextBazar concerning your access to and use of our platform.",
  },
  {
    id: "accounts",
    title: "2. Account Creation & Security",
    content: "To access certain features of NextBazar, you are required to register for an account. You agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and password.",
    details: "You must notify us immediately upon becoming aware of any unauthorized use or breach of security related to your account. NextBazar cannot and will not be liable for any loss or damage arising from your failure to comply with these security obligations.",
  },
  {
    id: "purchases",
    title: "3. Payments & Transaction Fees",
    content: "NextBazar is a multivendor marketplace where sellers list products and buyers make purchases. We utilize secure payment gateways to process financial transactions. By purchasing on the platform, you agree to pay all charges incurred, including taxes and shipping fees.",
    details: "NextBazar charges a commission fee to sellers on completed sales. All payment details are encrypted using industry-standard protocols. We do not store full credit card information on our servers.",
  },
  {
    id: "seller-rules",
    title: "4. Seller Rules & Conduct",
    content: "Sellers on NextBazar must undergo a verification process. Sellers are responsible for ensuring that their product listings are accurate, do not violate any intellectual property rights, and comply with local laws. Prohibited listings will be removed immediately.",
    details: "Payouts to sellers are disbursed according to our marketplace payout schedule. NextBazar reserves the right to hold funds in case of disputes, chargebacks, or suspected fraudulent activity.",
  },
  {
    id: "intellectual-property",
    title: "5. Intellectual Property Rights",
    content: "Unless otherwise indicated, the platform, source code, databases, design, graphics, and trademarks are our proprietary property and protected by copyright and trademark laws. Content uploaded by users remains their property, but they grant NextBazar a license to display it.",
    details: "You may not copy, reproduce, aggregate, republish, upload, post, publicly display, or distribute any part of the platform without our express prior written permission.",
  },
  {
    id: "liability",
    title: "6. Limitation of Liability",
    content: "NextBazar and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses resulting from your access to or use of the platform.",
    details: "We make no warranties or representations about the accuracy or completeness of the platform's content or the content of any websites linked to this platform.",
  },
  {
    id: "termination",
    title: "7. Account Termination",
    content: "We reserve the right to suspend or terminate your account and access to the platform at our sole discretion, without notice or liability, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.",
    details: "Upon termination, your right to use the platform will immediately cease. If you wish to terminate your account voluntarily, you may do so in your dashboard settings.",
  },
  {
    id: "governing-law",
    title: "8. Governing Law & Dispute Resolution",
    content: "These Terms of Service shall be governed by and defined under the laws of the country in which NextBazar operates. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts.",
    details: "Any cause of action you may have with respect to the services must be commenced within one year after the claim or cause of action arises or be barred.",
  },
];

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = termSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Account for sticky navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Header */}
      <section className="relative py-20 bg-white dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-primary font-black text-xs uppercase tracking-widest">Rules & Regulations</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using NextBazar. By accessing the platform, you agree to be bound by these legal rules.
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last Updated: May 22, 2026
          </div>
        </div>
      </section>

      {/* TL;DR Key Takeaways */}
      <section className="py-12 container mx-auto px-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-center">
          TL;DR: The Key Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tldrPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-4 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`p-4 h-12 w-12 rounded-2xl ${point.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 ${point.color}`} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">{point.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Terms Body & Sidebar Search Section */}
      <section className="py-12 container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Floating Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                  Table of Contents
                </h4>
                <ul className="space-y-3">
                  {termSections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => handleScroll(section.id)}
                        className="text-left font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1 group w-full"
                      >
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                        <span className="truncate">{section.title.split(". ")[1]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help Widget */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                <HelpCircle className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-black text-lg mb-2">Have Questions?</h4>
                <p className="text-xs text-slate-400 font-medium mb-4 leading-relaxed">
                  If you need clarification about our terms, our support team is happy to help you.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary-foreground hover:bg-primary px-4 py-2 rounded-xl bg-primary/10 transition-all"
                >
                  Contact Support <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Live Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search legal clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-base placeholder:text-slate-400 focus-visible:ring-primary outline-none transition-all"
              />
            </div>

            {/* Filtered Term List */}
            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                  <article
                    id={section.id}
                    key={section.id}
                    className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                      {section.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 font-medium text-base leading-relaxed mb-4">
                      {section.content}
                    </p>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-l-4 border-primary/50 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {section.details}
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
                  <HelpCircle className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-200">No clauses found</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">
                    Try searching for different keywords, or check back later.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}

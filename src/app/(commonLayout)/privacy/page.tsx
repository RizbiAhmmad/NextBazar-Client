"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Eye, 
  Settings, 
  Trash2, 
  Mail, 
  Lock, 
  Globe, 
  UserCheck, 
  Check, 
  AlertTriangle 
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PrivacyPage() {
  // Privacy Settings Simulation States
  const [personalization, setPersonalization] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // Deletion Request States
  const [deletionEmail, setDeletionEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = (setting: string, val: boolean, label: string) => {
    if (setting === "personalization") setPersonalization(val);
    if (setting === "analytics") setAnalytics(val);
    if (setting === "marketing") setMarketing(val);
    
    toast.success(`${label} has been ${val ? "enabled" : "disabled"}.`);
  };

  const handleRequestDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      toast.success("Erase Request Sent! A verification link has been sent to " + deletionEmail, {
        description: "Your data will be securely purged after verification.",
        duration: 5000,
      });
      setDeletionEmail("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Header */}
      <section className="relative py-20 bg-white dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/4" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] translate-y-1/3 translate-x-1/3" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-primary font-black text-xs uppercase tracking-widest">Privacy Protection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Your trust is our most valuable asset. Learn how we collect, store, safeguard, and use your data.
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last Updated: May 22, 2026
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Interactive Preference Dashboard & Request Erasure */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Preference Dashboard */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Privacy Controls</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Simulate your tracking preferences</p>
                </div>
              </div>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800" />
              
              <div className="space-y-6">
                {/* Setting 1 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Personalization Cookies</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                      Enables tailored product grids, search recommendations, and vendor offers.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("personalization", !personalization, "Personalization grid")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      personalization ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        personalization ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 2 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Analytical Logs</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                      Anonymously records page load times, search errors, and device layouts.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("analytics", !analytics, "Analytical cookies")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      analytics ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        analytics ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Setting 3 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Marketing & Newsletters</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                      Sends seasonal sales, customized vouchers, and system feature releases.
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("marketing", !marketing, "Marketing newsletters")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      marketing ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        marketing ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Request Data Erasure Form */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Trash2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Erase My Data</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rights to be forgotten</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10">
                Submit your registered email address below. We will send you a verification link to confirm account removal and completely delete your purchase history, profile information, and cache records.
              </p>

              <form onSubmit={handleRequestDeletion} className="space-y-4 relative z-10">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={deletionEmail}
                    onChange={(e) => setDeletionEmail(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 transition-all font-bold"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isDeleting}
                  className="w-full h-12 rounded-xl bg-primary hover:opacity-90 transition-opacity text-white font-black uppercase tracking-widest text-xs"
                >
                  {isDeleting ? "Processing..." : "Request Data Erasure"}
                </Button>
              </form>

              <div className="flex gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-xs text-yellow-500 font-bold relative z-10 leading-relaxed">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>Caution: This action is irreversible. Once confirmed, your user points, seller accounts, and digital files will be permanently purged.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Legal Answers */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
                Privacy Information Details
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {/* Item 1 */}
                <AccordionItem value="item-1" className="border border-slate-100 dark:border-slate-850 rounded-2xl px-5 py-2">
                  <AccordionTrigger className="text-base font-black hover:no-underline text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-primary shrink-0" />
                      1. Information We Collect
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-2">
                    <p className="mb-3">
                      We collect information to provide better services to all our users. This includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                      <li><strong>Personal Identity Info:</strong> Name, email address, physical address, and contact details.</li>
                      <li><strong>Commercial Activity Info:</strong> Products purchased, items added to cart, seller commission details, and general shop performance logs.</li>
                      <li><strong>Technical Identifiers:</strong> IP addresses, browser agent descriptions, cookie configurations, and site speed logs.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Item 2 */}
                <AccordionItem value="item-2" className="border border-slate-100 dark:border-slate-850 rounded-2xl px-5 py-2">
                  <AccordionTrigger className="text-base font-black hover:no-underline text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary shrink-0" />
                      2. How We Secure Your Data
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-2">
                    <p>
                      We utilize top-tier digital safety standards to guard your database logs. This includes SSL/TLS channel encryptions for financial data transactions, password hashing configurations (bcrypt/argon2 models), and firewalls limiting direct access to core server instances.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Item 3 */}
                <AccordionItem value="item-3" className="border border-slate-100 dark:border-slate-850 rounded-2xl px-5 py-2">
                  <AccordionTrigger className="text-base font-black hover:no-underline text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary shrink-0" />
                      3. Sharing Information With Third Parties
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-2">
                    <p className="mb-2">
                      We do not sell your personal data records. We share details solely under the following scenarios:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Logistics Providers:</strong> Sharing name and address with courier teams to ship products.</li>
                      <li><strong>Financial Gateways:</strong> Safe token pass-throughs to verify payment card authenticity.</li>
                      <li><strong>Legal Compliance:</strong> When required by governing agencies or active court instructions.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Item 4 */}
                <AccordionItem value="item-4" className="border border-slate-100 dark:border-slate-850 rounded-2xl px-5 py-2">
                  <AccordionTrigger className="text-base font-black hover:no-underline text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-primary shrink-0" />
                      4. Your GDPR & Privacy Rights
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-2">
                    <p>
                      Under GDPR and other privacy legislations, you hold rights to: access stored archives of your data profile, correct erroneous logs, dispute specific analytical tracking tasks, and invoke data erasure sequences (supported by the Data Control panel widget on this page).
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

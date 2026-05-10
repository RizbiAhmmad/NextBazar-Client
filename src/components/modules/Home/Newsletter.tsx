import { Button } from "@/components/ui/button";
import { Mail, Sparkles, Send } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-8">
      <div className="bg-slate-50 rounded-[4rem] p-8 md:p-16 lg:p-20 relative overflow-hidden flex flex-col items-center text-center">
        {/* Abstract background blobs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-slate-800 font-black text-xs uppercase tracking-widest">
              Never miss a deal
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Subscribe to our Newsletter
          </h2>

          <p className="text-slate-500 text-xl font-medium leading-relaxed">
            Get the latest updates on new products, exclusive deals, and vendor
            spotlights directly in your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto pt-4">
            <div className="relative flex-1">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800"
              />
            </div>
            <Button className="h-16 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Join Now <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Users, ShieldCheck, Heart, Zap, Store, Globe } from "lucide-react";

const values = [
  {
    title: "Community First",
    description: "We empower small vendors and local businesses to reach a global audience.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Secure Shopping",
    description: "Your trust is our priority. Every transaction is protected with military-grade security.",
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    title: "Quality Obsessed",
    description: "We hand-verify every vendor to ensure you only get the best products.",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-50"
  }
];

const stats = [
  { label: "Active Vendors", value: "2,500+", icon: Store },
  { label: "Happy Customers", value: "1M+", icon: Heart },
  { label: "Global Reach", value: "15+ Countries", icon: Globe },
  { label: "Daily Shipments", value: "10k+", icon: Zap }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-8">
              Redefining the <span className="text-primary">Marketplace</span> for Everyone.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              NextBazar isn&apos;t just an e-commerce platform. It&apos;s a digital ecosystem built to bridge the gap between talented vendors and conscious consumers.
            </p>
          </div>
        </div>
      </section>

      {/* Image & Story Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                alt="Our Team" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-primary font-bold text-xs uppercase tracking-widest">Our Story</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Founded on Trust, Driven by Innovation</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                Started in 2024, NextBazar was born out of a simple observation: small businesses were struggling to compete with giants. We decided to level the playing field.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {stats.slice(0, 2).map((stat, i) => (
                   <div key={i}>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Values that guide us</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">We believe in building more than just a website; we&apos;re building a community built on shared success and integrity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                <div className={`${value.bg} dark:bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`h-8 w-8 ${value.color}`} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{value.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section className="py-24 bg-[#0f172a] rounded-[4rem] mx-6 mb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}

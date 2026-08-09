import { Star } from "lucide-react";
import Image from "next/image";
import SectionHeading from "@/components/shared/SectionHeading";

const testimonials = [
  {
    name: "Rizbi Ahmmad",
    role: "Regular Buyer",
    content:
      "The quality of products and the speed of delivery is unmatched. I've been shopping here for months and never had an issue.",
    avatar: "https://i.pravatar.cc/150?u=rizbi",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Verified Seller",
    content:
      "Transitioning my local business to NextBazar was the best decision. The vendor tools are intuitive and sales have doubled.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Tech Enthusiast",
    content:
      "Found some rare gadgets here that were unavailable elsewhere. The search and filtering system makes it so easy to find niche items.",
    avatar: "https://i.pravatar.cc/150?u=michael",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-10">
      <SectionHeading
        eyebrow="Testimonials"
        title="What Our Community Says"
        subtitle="Hear from our diverse community of buyers and sellers who make NextBazar the best marketplace."
        className="mb-16"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                />
              ))}
            </div>
            <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1 italic">
              &quot;{t.content}&quot;
            </p>
            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{t.name}</h4>
                <p className="text-primary font-bold text-[10px] uppercase tracking-widest">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

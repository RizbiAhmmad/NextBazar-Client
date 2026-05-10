import Image from "next/image";
import { ArrowRight, Calendar, User, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogs = [
  {
    id: 1,
    title: "How to Choose the Perfect Gadget for Your Lifestyle",
    excerpt:
      "Discover the ultimate guide to selecting electronics that fit your daily routine without breaking the bank.",
    image:
      "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=2070&auto=format&fit=crop",
    author: "Rizbi Ahmmad",
    date: "May 10, 2024",
    category: "Tech Guide",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "10 Summer Fashion Trends You Can't Miss This Year",
    excerpt:
      "From breathable linen to vibrant floral prints, here's what you should be wearing this sunny season.",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    author: "Sarah J.",
    date: "May 08, 2024",
    category: "Fashion",
    color: "bg-pink-500",
  },
  {
    id: 3,
    title: "The Ultimate Guide to Starting Your Own Online Shop",
    excerpt:
      "Everything you need to know about inventory management, customer service, and scaling your business.",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
    author: "Michael C.",
    date: "May 05, 2024",
    category: "Business",
    color: "bg-emerald-500",
  },
  {
    id: 4,
    title: "Interior Design: 5 Tips for a Modern Living Room",
    excerpt:
      "Transform your home with these simple and affordable decor ideas from top verified designers.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    author: "Emily R.",
    date: "May 02, 2024",
    category: "Home Decor",
    color: "bg-amber-500",
  },
  {
    id: 5,
    title: "Healthy Living: Choosing Organic Products Wisely",
    excerpt:
      "Why organic matters and how to identify genuine verified products in our marketplace.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    author: "David K.",
    date: "April 28, 2024",
    category: "Wellness",
    color: "bg-purple-500",
  },
  {
    id: 6,
    title: "Future of E-commerce: What to Expect in 2025",
    excerpt:
      "Exploring the role of AI, AR, and hyper-personalization in the next generation of shopping.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
    author: "NextBazar Team",
    date: "April 25, 2024",
    category: "Tech",
    color: "bg-slate-900",
  },
];

const categories = [
  "All Posts",
  "Tech Guide",
  "Fashion",
  "Business",
  "Home Decor",
  "Wellness",
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-slate-50 pt-24 pb-20 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm border border-slate-100">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-primary font-black text-xs uppercase tracking-widest">
                NextBazar Journal
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
              Insights into the{" "}
              <span className="text-primary">Marketplace</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Explore our latest articles, guides, and stories from the world of
              e-commerce, fashion, and technology.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-xl relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/20 focus:border-primary/30 outline-none transition-all font-bold text-slate-800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Categories Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-12 scrollbar-hide no-scrollbar">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                  i === 0
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-6 left-6 ${blog.color} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest`}
                  >
                    {blog.category}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-primary" />{" "}
                      {blog.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={12} className="text-primary" /> {blog.author}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  <Button
                    variant="ghost"
                    className="w-fit p-0 h-auto font-black text-xs uppercase tracking-widest text-primary hover:bg-transparent group/btn"
                  >
                    Read More{" "}
                    <ArrowRight
                      size={14}
                      className="ml-2 group-hover/btn:translate-x-2 transition-transform"
                    />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-20 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50"
            >
              Load More Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

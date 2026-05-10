import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
} from "lucide-react";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white pt-24 pb-16 border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
              Let&apos;s Start a <span className="text-primary">Conversation</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Have a question about our marketplace? Whether you&apos;re a shopper or a potential vendor, our team is here to help you 24/7.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-8">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</label>
                    <select className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all font-bold appearance-none">
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Vendor Partnership</option>
                      <option>Billing Question</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Message</label>
                    <textarea 
                      rows={5} 
                      placeholder="How can we help you?" 
                      className="w-full p-6 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all font-bold resize-none"
                    />
                  </div>
                  <Button className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 w-full sm:w-auto">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-5 space-y-8">
              {/* Quick Contact */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 px-1">Quick Contact</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Call Support</p>
                      <p className="font-black text-slate-800 text-lg">+880 1700-000000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="font-black text-slate-800 text-lg">hello@nextbazar.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Location */}
              <div className="p-8 rounded-[3rem] bg-slate-900 text-white space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-xl font-black relative z-10">Our Headquarters</h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <p className="text-slate-400 font-medium">123 Market Street, Suite 456<br />Tech Valley, Dhaka 1212</p>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-slate-200">Monday - Friday</p>
                      <p className="text-slate-400 text-sm font-medium">9:00 AM - 6:00 PM (GMT+6)</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/10 relative z-10">
                  <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/10 text-white hover:bg-white/10 hover:text-primary"><FaTwitter size={18} /></Button>
                  <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/10 text-white hover:bg-white/10 hover:text-primary"><FaInstagram size={18} /></Button>
                  <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/10 text-white hover:bg-white/10 hover:text-primary"><FaFacebook size={18} /></Button>
                  <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/10 text-white hover:bg-white/10 hover:text-primary"><FaLinkedin size={18} /></Button>
                </div>
              </div>

              {/* Chat Support CTA */}
              <div className="p-8 rounded-[3rem] bg-primary text-white flex items-center justify-between group cursor-pointer hover:shadow-2xl hover:shadow-primary/30 transition-all">
                <div className="space-y-1">
                  <h3 className="text-xl font-black">Live Chat</h3>
                  <p className="text-primary-foreground/70 font-bold text-sm">Response time: ~5 mins</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

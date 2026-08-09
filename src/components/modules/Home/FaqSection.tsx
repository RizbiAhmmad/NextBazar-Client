import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeading from "@/components/shared/SectionHeading";

const faqs = [
  {
    question: "How do I become a seller on NextBazar?",
    answer:
      "Becoming a seller is easy! Simply click on the 'Become a Seller' button in the navbar, fill out your shop details, and once our team verifies your information, you can start listing products.",
  },
  {
    question: "What are the shipping costs?",
    answer:
      "Shipping costs vary depending on the vendor's location and your delivery address. You can see the exact shipping fee at the checkout page before completing your purchase.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, absolutely. We use industry-standard encryption and secure payment gateways to process all transactions. Your sensitive payment details are never stored on our servers.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking ID. You can go to 'My Orders' in your user dashboard to see the real-time status of your package.",
  },
  {
    question: "What is the return policy?",
    answer:
      "We have a 7-day easy return policy for most items. If the product is damaged or not as described, you can initiate a return request from your dashboard.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-10 max-w-4xl mx-auto">
      <SectionHeading
        eyebrow="Support Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about shopping and selling on NextBazar."
        className="mb-16"
      />

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-slate-100 rounded-[2rem] px-6 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="hover:no-underline py-6 font-bold text-slate-800 text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-500 font-medium leading-relaxed pb-6">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

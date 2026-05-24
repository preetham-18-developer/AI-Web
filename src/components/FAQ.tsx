import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-border">
      <button
        onClick={onClick}
        className={`w-full py-5 flex justify-between items-center text-left transition-colors duration-200 group ${isOpen ? 'text-accent' : 'text-text-primary hover:text-accent'}`}
      >
        <span className="font-body font-semibold text-[16px] pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex-shrink-0 text-accent flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 font-body text-[15px] text-text-secondary leading-[1.8]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What do I need to provide to get started?",
      a: "Not much at all. Once you book and pay, we'll reach out on WhatsApp to collect your raw footage or concept brief. If you have a reference video in mind, even better — just share the link. We handle everything from there. No complicated forms, no lengthy briefs required."
    },
    {
      q: "How long does the editing actually take?",
      a: "Most sessions are delivered within 24 to 48 hours. Pro plan clients get priority delivery in 24 hours. If there's ever a delay for any reason, we'll let you know in advance — no surprises, ever."
    },
    {
      q: "What if I don't like the final result?",
      a: "Every plan includes at least one revision round — and Pro includes unlimited revisions. Just tell us what you'd like changed and we'll fix it, no questions asked. Our goal is that you're genuinely happy with every frame before you post it."
    },
    {
      q: "What happens if my time slot is already booked by someone else?",
      a: "Because we work as a team, most slots can handle multiple bookings at the same time. Each time slot shows availability based on our current team capacity — so if a slot is open, it means a team member is genuinely available for you. You'll never be double-booked or left waiting."
    },
    {
      q: "Is my payment secure? What if something goes wrong?",
      a: "Payments are processed entirely through Razorpay — one of India's most trusted payment platforms. Your card or UPI details are never stored on our side. If a payment goes through but something unexpected happens on our end, we'll make it right immediately. We've never had a payment dispute go unresolved."
    },
    {
      q: "Can I book a session for my client or someone else's brand?",
      a: "Absolutely. Many of our clients are social media managers or agencies booking on behalf of their clients. Just make sure the brief and raw footage are ready before the session, and it works exactly the same way."
    },
    {
      q: "Do you edit for all content niches?",
      a: "Yes. We've worked across fitness, motivation, lifestyle, business, food, travel, and more. If it works as a short-form vertical video, we can make it cinematic. The AI tools we use are niche-agnostic — what we bring is creative judgment on top of the technology."
    },
    {
      q: "What if I want to cancel or reschedule my session?",
      a: "Reach out to us on WhatsApp as early as possible and we'll sort it out. We're flexible with rescheduling — life happens. Cancellations are handled case by case, and we always try to find a fair solution for everyone involved."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-bg border-t border-border">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
          >
            GOT QUESTIONS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[32px] md:text-[48px] text-text-primary mb-4"
          >
            Everything You Need to Know
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-[16px] text-text-secondary"
          >
            Still unsure? Everything is answered right here.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-border"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4"
        >
          <p className="font-body text-[15px] text-text-secondary">Still have a question?</p>
          <a
            href="https://wa.me/917893287376?text=Hi%20Salman%2C%20I%20have%20a%20question%20about%20booking%20a%20session."
            target="_blank"
            rel="noreferrer"
            className="h-[44px] px-6 bg-transparent border border-accent text-accent rounded-lg font-body font-semibold text-[14px] flex items-center justify-center hover:bg-accent-soft transition-all duration-200"
          >
            Ask on WhatsApp →
          </a>
        </motion.div>

      </div>
    </section>
  );
};

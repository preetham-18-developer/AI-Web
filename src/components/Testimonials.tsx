import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at?: string;
}

export const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || '';
        const res = await axios.get(`${API_URL}/api/feedback`);
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [reviews, activeIdx]);

  if (reviews.length === 0) return null;

  const current = reviews[activeIdx];

  return (
    <section className="py-24 bg-bg border-t border-border relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[45vw] h-[45vw] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04),transparent_60%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
          >
            CLIENT REVIEWS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[32px] md:text-[44px] text-text-primary mb-4"
          >
            What Clients Say About Us
          </motion.h2>
        </div>

        {/* Carousel slide container */}
        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full bg-surface border border-border/80 rounded-[24px] p-6 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col items-center"
            >
              {/* Star Rating display */}
              <div className="flex gap-1 mb-5 select-none">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`text-[20px] ${idx < current.rating ? 'text-yellow-500 font-bold' : 'text-text-muted font-normal'}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review Comment */}
              <p className="font-body text-[16px] md:text-[18px] text-text-secondary leading-[1.8] italic mb-6 max-w-2xl">
                "{current.comment}"
              </p>

              {/* Client details */}
              <h4 className="font-display font-semibold text-[15px] text-text-primary tracking-wide">
                — {current.name}
              </h4>
              <span className="font-body text-[11px] text-text-muted uppercase tracking-widest mt-1">Verified Customer</span>
            </motion.div>
          </AnimatePresence>

          {/* Premium Next & Previous navigation buttons */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
                className="absolute left-[-12px] md:left-[-70px] top-1/2 -translate-y-1/2 w-11 h-11 bg-surface border border-border/80 hover:border-accent/40 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-200 shadow-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] z-20 cursor-pointer"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIdx((prev) => (prev + 1) % reviews.length)}
                className="absolute right-[-12px] md:right-[-70px] top-1/2 -translate-y-1/2 w-11 h-11 bg-surface border border-border/80 hover:border-accent/40 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-200 shadow-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] z-20 cursor-pointer"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicators */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2.5 mt-8 select-none">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === activeIdx ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-text-secondary'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

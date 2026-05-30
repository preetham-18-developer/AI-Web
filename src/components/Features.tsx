import { motion } from 'framer-motion';

export const Features = () => {
  const features = [
    {
      title: "Easy Booking",
      desc: "Stop struggling with complex booking procedure",
      image: "/easy_booking.jpg"
    },
    {
      title: "Instant Reels, Instant Editing",
      desc: "Don't wait a day—get professional, trend-ready Instagram Reels edited and delivered in 10 minutes flat.",
      image: "/instant_editing.jpg"
    },
    {
      title: "AI Edits",
      desc: "We create stunning, ultra-high-resolution futuristic visuals and concept art from scratch using advanced generation",
      image: "/ai_edits.jpg"
    },
    {
      title: "Unbelievable Pricing",
      desc: "Each Reel starts 1999/-",
      image: "/unbelievable_pricing.jpg"
    }
  ];

  return (
    <section id="features" className="py-24 bg-bg border-t border-border relative overflow-hidden">
      {/* Subtle dynamic background glowing lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[45vw] h-[45vw] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03),transparent_65%)] top-1/4 -left-10" />
        <div className="absolute w-[40vw] h-[40vw] bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.02),transparent_60%)] bottom-10 -right-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
          >
            WHY CHOOSE US
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[32px] md:text-[48px] text-text-primary mb-4"
          >
            Not Just Instant <span className="text-accent">Delivery, But..</span>
          </motion.h2>
        </div>

        {/* 2x2 grid representing 4 premium graphic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className="bg-[#0c0c0e]/60 border border-border/80 rounded-[24px] overflow-hidden hover:border-accent/35 hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] transition-all duration-300 group aspect-[16/9] relative cursor-pointer"
            >
              <img 
                src={feature.image} 
                alt={`${feature.title} - ${feature.desc}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]" 
              />
              
              {/* Premium overlay to slightly darken bottom and sides for visual depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Visually hidden but indexable content for screen readers & search engines (SEO) */}
              <span className="sr-only">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

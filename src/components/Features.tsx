import { motion } from 'framer-motion';

export const Features = () => {
  const features = [
    {
      icon: "🎬",
      title: "AI-Powered Editing",
      desc: "Cutting-edge AI tools for reels that stop the scroll every time"
    },
    {
      icon: "👥",
      title: "Dedicated Team",
      desc: "Multiple editors — your session is never delayed or reassigned without notice"
    },
    {
      icon: "⚡",
      title: "24–48hr Delivery",
      desc: "Fast turnaround without compromising a single frame of quality"
    },
    {
      icon: "🔒",
      title: "Secure Booking",
      desc: "Razorpay-powered payments — 100% safe, instant confirmation via email"
    }
  ];

  return (
    <section id="features" className="py-24 bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            className="font-display text-[32px] md:text-[48px] text-text-primary"
          >
            Built for Viral Growth
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="bg-surface border border-border rounded-[16px] p-7 hover:border-accent/40 hover:-translate-y-[4px] transition-all duration-300 group"
            >
              <div className="w-[56px] h-[56px] bg-accent-soft rounded-[12px] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-[16px] text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-[14px] text-text-secondary leading-[1.7]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

import { motion } from 'framer-motion';

export const Process = () => {
  const steps = [
    {
      num: 1,
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Pick Your Date & Time",
      desc: "Choose a session slot that works for you. Our team capacity means even popular times are almost always available."
    },
    {
      num: 2,
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Tell Us What You Need",
      desc: "After booking, you'll share your raw footage or concept, the vibe you're going for, and any references. Takes 5 minutes."
    },
    {
      num: 3,
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "AI + Human Craft",
      desc: "Our editors combine cutting-edge AI tools with years of creative instinct. Every cut, every transition, every frame — intentional."
    },
    {
      num: 4,
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Your Reel, Ready to Post",
      desc: "Delivered in 24–48 hours. Review it, request your included revision if needed, and post. It's that clean."
    }
  ];

  return (
    <section id="process" className="py-24 bg-bg border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
          >
            THE PROCESS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[32px] md:text-[48px] text-text-primary mb-4"
          >
            Simple. Fast. Cinematic.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-[16px] text-text-secondary"
          >
            From booking to delivered Reel — here's exactly what happens.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[24px] left-0 w-full h-[1px] border-t border-dashed border-[rgba(232,98,42,0.25)] z-0" />
          <div className="md:hidden absolute top-0 bottom-0 left-[44px] w-[1px] border-l border-dashed border-[rgba(232,98,42,0.25)] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center group"
              >
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-full bg-accent-soft border border-[rgba(232,98,42,0.3)] flex items-center justify-center font-mono text-[18px] text-accent font-bold md:mb-6 z-10 bg-bg transition-transform duration-300 group-hover:scale-110">
                    {step.num}
                  </div>
                </div>
                
                <div className="ml-6 md:ml-0 flex flex-col md:items-center">
                  <div className="mb-4 hidden md:block">
                    {step.icon}
                  </div>
                  <h3 className="font-display font-semibold text-[16px] text-text-primary mb-3 mt-1 md:mt-0 flex items-center gap-3">
                    <span className="md:hidden">{step.icon}</span>
                    {step.title}
                  </h3>
                  <p className="font-body text-[14px] text-text-secondary leading-[1.7] max-w-[260px]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center justify-center"
        >
          <a
            href="#book"
            className="h-12 px-8 bg-accent rounded-lg font-body font-semibold text-[15px] text-white flex items-center justify-center hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,98,42,0.3)] transition-all duration-250 ease-out mb-3"
          >
            Book a Session →
          </a>
          <p className="font-body text-[12px] text-text-muted text-center">
            No commitment until payment. Cancel anytime before your slot.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

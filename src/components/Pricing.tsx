import { motion } from 'framer-motion';

export const Pricing = () => {
  const plans = [
    {
      name: "STARTER",
      price: "1,999",
      features: [
        "1 Instagram Reel (up to 30 seconds)",
        "Basic AI Editing + Cuts",
        "Background Music Sync",
        "1 Revision Round",
        "Delivery in 48 Hours"
      ]
    },
    {
      name: "GROWTH",
      price: "3,999",
      popular: true,
      features: [
        "3 Instagram Reels (up to 60 seconds each)",
        "Advanced AI Editing + Color Grading",
        "Custom Captions + Subtitles",
        "Motion Graphics Overlays",
        "2 Revision Rounds",
        "Delivery in 36 Hours",
        "Priority Support"
      ]
    },
    {
      name: "PRO",
      price: "7,499",
      features: [
        "5 Instagram Reels (up to 90 seconds each)",
        "Full AI Visual Effects + Avatar Integration",
        "Music Sync + Sound Design",
        "Advanced Color Grading",
        "Unlimited Revisions",
        "Delivery in 24 Hours",
        "Dedicated Team Member Assigned",
        "Direct WhatsApp Line"
      ]
    }
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    const planString = `${plan.name.charAt(0) + plan.name.slice(1).toLowerCase()} – ₹${plan.price}`;
    window.dispatchEvent(new CustomEvent('selectPlan', { detail: planString }));
    const el = document.getElementById('book');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 bg-bg border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
          >
            TRANSPARENT PRICING
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[32px] md:text-[48px] text-text-primary mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-[16px] text-text-secondary"
          >
            All prices in Indian Rupees. No hidden charges. Pay only after booking.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className={`w-full max-w-sm relative bg-surface border rounded-[16px] p-8 flex flex-col transition-all duration-300
                ${plan.popular 
                  ? 'border-accent/50 shadow-[0_0_0_1px_rgba(232,98,42,1),0_20px_60px_rgba(232,98,42,0.15)] lg:scale-104 z-10' 
                  : 'border-border hover:-translate-y-1'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1/2 bg-gold text-[#0A0A0C] font-body font-bold text-[11px] px-4 py-1.5 rounded-full z-20 shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="font-body text-[11px] text-text-secondary tracking-[0.1em] uppercase mb-4">
                {plan.name}
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="font-mono text-[48px] text-text-primary leading-none">₹{plan.price}</span>
                <span className="font-body text-[13px] text-text-secondary ml-2">/session</span>
              </div>

              <div className="w-full h-[1px] bg-border mb-6"></div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent mr-3 font-bold mt-0.5">✓</span>
                    <span className="font-body text-[14px] text-text-secondary leading-[1.6]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full h-[44px] rounded-[8px] font-body font-semibold text-[14px] flex items-center justify-center transition-all duration-300
                  ${plan.popular
                    ? 'bg-accent text-white hover:brightness-110 hover:shadow-[0_0_20px_rgba(232,98,42,0.3)]'
                    : 'bg-transparent border border-accent text-accent hover:bg-accent-soft'
                  }
                `}
              >
                Select {plan.name.charAt(0) + plan.name.slice(1).toLowerCase()} →
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

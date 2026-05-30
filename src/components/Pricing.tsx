import { motion } from 'framer-motion';
import { Check, Camera, Clock, Zap } from 'lucide-react';

const plans = [
  {
    id: "hourly",
    name: "Hourly Plan",
    price: "1,999",
    gst: true,
    tagline: "Perfect for people who want a single, fast, high quality reel.",
    icon: Clock,
    popular: false,
    features: [
      "Upto 1 Hour Shoot Time",
      "Basic AI Editing + Cuts",
      "1 Edited Reel Delivered (upto 60 seconds)",
      "5 Complementary Pictures",
      "Trained and Certified Reel Maker",
      "Shot on Latest iPhones",
      "ShotzyHub Branding Included",
    ],
  },
  {
    id: "halfday",
    name: "Half Day Plan",
    price: "4,999",
    gst: true,
    tagline: "Quick, high quality coverage for events & socials delivered fast.",
    icon: Camera,
    popular: true,
    features: [
      "Upto 3 Hours Shoot Time",
      "Advanced AI Editing + Color Grading",
      "2 Edited Reels Delivered (each upto 60 seconds)",
      "5 Complementary Pictures",
      "Trained and Certified Reel Maker",
      "Raw Footage Access",
      "Shot on Latest iPhones",
      "ShotzyHub Branding Included",
    ],
  },
  {
    id: "fullevent",
    name: "Full Event",
    price: "10,000",
    gst: true,
    tagline: "Complete end-to-end coverage with premium AI editing and full effects.",
    icon: Zap,
    popular: false,
    features: [
      "Upto 8 Hours Shoot Time",
      "4 Edited Reels Delivered (upto 60 seconds each)",
      "Advanced AI Editing + Color Grading",
      "Full AI Visual Effects + Avatar Integration",
      "Delivery in 10 Minutes",
      "Shot on Latest iPhones",
      "ShotzyHub Branding Included",
    ],
  },
];

export const Pricing = () => {
  const handleSelectPlan = (plan: typeof plans[0]) => {
    const planString = `${plan.name} – ₹${plan.price}`;
    window.dispatchEvent(new CustomEvent('selectPlan', { detail: planString }));
    const el = document.getElementById('book');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 bg-bg border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
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
            All prices + GST. No hidden charges. Pay only after booking.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-6">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                className={`w-full max-w-sm flex-1 relative bg-surface border rounded-[20px] p-8 flex flex-col transition-all duration-300 group
                  ${plan.popular
                    ? 'border-accent/60 shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_20px_60px_rgba(37,99,235,0.18)] lg:scale-[1.04] z-10'
                    : 'border-border hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_10px_40px_rgba(37,99,235,0.08)]'
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-accent text-white font-body font-bold text-[10px] px-4 py-1.5 rounded-full shadow-[0_0_16px_rgba(37,99,235,0.5)] tracking-widest uppercase z-20">
                    MOST POPULAR
                  </div>
                )}

                {/* Icon + Plan Name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl border ${plan.popular ? 'bg-accent/15 border-accent/30 text-accent' : 'bg-surface-2 border-border text-text-secondary group-hover:text-accent group-hover:border-accent/30 transition-colors'}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-body text-[12px] text-text-secondary tracking-[0.1em] uppercase font-semibold">
                    {plan.name}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-[44px] text-text-primary leading-none font-bold">₹{plan.price}</span>
                  </div>
                  <span className="font-body text-[12px] text-text-muted">+ GST &nbsp;·&nbsp; per session</span>
                </div>

                {/* Tagline */}
                <p className="font-body text-[13.5px] text-text-secondary leading-[1.65] mb-6 min-h-[48px]">
                  {plan.tagline}
                </p>

                <div className="w-full h-[1px] bg-border mb-6" />

                {/* Features */}
                <p className="font-body text-[10px] text-text-muted uppercase tracking-[0.15em] font-semibold mb-4">
                  What's Included
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? 'bg-accent/20 text-accent' : 'bg-surface-2 text-text-secondary group-hover:bg-accent/15 group-hover:text-accent transition-colors'}`}>
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                      <span className="font-body text-[13.5px] text-text-secondary leading-[1.55]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full h-[46px] rounded-[10px] font-body font-semibold text-[14px] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer
                    ${plan.popular
                      ? 'bg-accent text-white hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.35)]'
                      : 'bg-transparent border border-accent/50 text-accent hover:bg-accent-soft hover:border-accent'
                    }
                  `}
                >
                  Select This Plan →
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CountUp = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const About = () => {
  return (
    <section id="about" className="py-24 bg-bg border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-24">
          {/* Left Column */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
            >
              OUR STORY
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-[32px] md:text-[44px] text-text-primary mb-6 leading-tight"
            >
              Crafting Frames That Move People
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-[16px] text-text-secondary leading-[1.8] max-w-[540px] mb-12"
            >
              Salman AI Video Editing was born from one obsession: making videos that stop the scroll and start the conversation. We combine cutting-edge AI tools with human creative instinct — every reel is precision-engineered to perform. From Instagram Reels for 11M+ audience pages to branded shorts that drive real results, we've built a reputation on one thing: proof of work.
            </motion.p>

            <div className="flex flex-wrap gap-8 md:gap-16">
              {[
                { end: 200, label: "Reels Delivered", suffix: "+" },
                { end: 50, label: "Happy Clients", suffix: "+" },
                { end: 11, label: "Audience Reached", suffix: "M+" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex flex-col"
                >
                  <span className="font-mono text-[36px] text-accent mb-1">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </span>
                  <span className="font-body text-[13px] text-text-secondary">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Founder Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-full lg:w-[340px] bg-surface border border-border rounded-[20px] p-8 flex flex-col items-center text-center relative mx-auto"
          >
            <div className="w-[120px] h-[120px] rounded-full border-3 border-accent flex items-center justify-center bg-surface-2 overflow-hidden mb-6">
              {/* REPLACE: swap this <img src> with Salman's actual photo before going live */}
              <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="font-display font-semibold text-[22px] text-text-primary mb-1">Salman</h3>
            <span className="font-body text-[13px] text-text-secondary tracking-[0.06em] uppercase mb-4">Founder & Lead Editor</span>
            
            <p className="font-body text-[14px] text-text-secondary leading-[1.7] italic mb-6">
              "AI video specialist with a passion for crafting viral content. I personally oversee every project to ensure your vision comes to life — frame by frame."
            </p>

            <div className="flex gap-4 mt-auto">
              <a href="https://www.instagram.com/mindset.therapy" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-[10px] bg-surface-2 border border-border flex items-center justify-center text-text-primary hover:border-[#E1306C] hover:text-[#E1306C] hover:scale-105 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://wa.me/91917893287376?text=Hi%20Salman%2C%20I%27m%20interested%20in%20booking%20a%20video%20editing%20session!" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-[10px] bg-surface-2 border border-border flex items-center justify-center text-[#25D366] hover:border-[#25D366] hover:scale-105 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Team Strip */}
        <div>
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 mb-4 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
            >
              THE TEAM
            </motion.span>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-[16px] text-text-secondary"
            >
              Every session is backed by specialists, not generalists.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎬", name: "Salman", role: "Founder & Lead AI Editor", desc: "Vision, storytelling, and final cut approval on every project" },
              { icon: "✂️", name: "Editor", role: "Senior Video Editor", desc: "Frame-perfect cuts and pacing that keeps viewers hooked" },
              { icon: "🎨", name: "Motion Designer", role: "VFX Specialist", desc: "Transitions, kinetic text, and visual effects that feel premium" },
              { icon: "🎵", name: "Sound Designer", role: "Audio Engineer", desc: "Music sync and audio design that makes reels feel cinematic" }
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-[16px] p-6 hover:border-accent/30 hover:-translate-y-[3px] transition-all duration-300"
              >
                <div className="w-10 h-10 bg-accent-soft rounded-[10px] flex items-center justify-center text-xl mb-4">
                  {member.icon}
                </div>
                <h4 className="font-display font-semibold text-[18px] text-text-primary mb-1">{member.name}</h4>
                <div className="font-body text-[12px] text-accent tracking-wide uppercase mb-3">{member.role}</div>
                <p className="font-body text-[13px] text-text-secondary leading-[1.6]">
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

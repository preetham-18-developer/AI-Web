import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const PORTFOLIO_REELS = [
  { id: 1, embedUrl: "https://www.instagram.com/p/DYPxeaKuhc9/embed/", label: "AI Edit #1" },
  { id: 2, embedUrl: "https://www.instagram.com/p/DYglCeESaDi/embed/", label: "AI Edit #2" },
  { id: 3, embedUrl: "https://www.instagram.com/p/DVMjiDhE-Yg/embed/", label: "AI Edit #3" },
  { id: 4, embedUrl: "https://www.instagram.com/p/DYmcKdZotSD/embed/", label: "AI Edit #4" },
  { id: 5, embedUrl: "https://www.instagram.com/p/DWwKCTbCB5f/embed/", label: "AI Edit #5" },
  { id: 6, embedUrl: "https://www.instagram.com/p/DV3ZOqwiJ-D/embed/", label: "AI Edit #6" }
];

const ReelCard = ({ embedUrl, label, index }: { embedUrl: string, label: string, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPreview = () => {
    setIsHovered(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 30000);
  };

  const stopPreview = () => {
    setIsHovered(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleIframeLoad = () => {
    if (iframeRef.current) {
      try {
        const height = iframeRef.current.contentWindow?.document?.body?.scrollHeight;
        if (height !== undefined && height < 50) {
          setHasError(true);
        }
      } catch {
        // Cross-origin access blocked
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="relative aspect-[9/16] rounded-[16px] overflow-hidden border border-border bg-surface group transition-all duration-300 hover:border-accent/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onTouchStart={startPreview}
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-2 p-6 text-center z-30">
          <svg className="w-12 h-12 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="font-body text-[14px] text-text-secondary mb-4">Content could not be embedded.</p>
          <a href={embedUrl.replace('/embed/', '/')} target="_blank" rel="noreferrer" className="bg-accent text-white font-body text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all">
            Watch on Instagram
          </a>
        </div>
      ) : (
        <>
          {/* Base Iframe - Static Thumbnail */}
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            frameBorder="0"
            scrolling="no"
            {...{ allowtransparency: "true" }}
            loading="lazy"
            title={label}
            onLoad={handleIframeLoad}
          />
          
          {/* Autoplay Iframe - Only injected when hovered to trigger play without breaking base thumbnail */}
          {isHovered && (
            <iframe
              src={`${embedUrl}?autoplay=1&muted=1`}
              className="absolute inset-0 w-full h-full z-10"
              frameBorder="0"
              scrolling="no"
              {...{ allowtransparency: "true" }}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              title={`${label} Preview`}
            />
          )}
          
          {/* Dark Overlay */}
          <div className={`absolute inset-0 bg-[#0a0a0c]/85 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none z-20 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <svg className="w-10 h-10 text-white mb-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <span className="font-display text-[16px] text-text-primary tracking-wide">{label}</span>
          </div>
        </>
      )}
    </motion.div>
  );
};

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24 bg-bg relative border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-6 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30"
          >
            PROOF OF WORK
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-[32px] md:text-[48px] text-text-primary mb-4"
          >
            Reels That Speak for Themselves
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-[16px] text-text-secondary"
          >
            Real work. Real results. Hover to preview.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO_REELS.map((reel, index) => (
            <ReelCard key={reel.id} embedUrl={reel.embedUrl} label={reel.label} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
};

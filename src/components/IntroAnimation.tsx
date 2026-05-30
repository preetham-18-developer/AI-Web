import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    return !sessionStorage.getItem('hasSeenIntro');
  });

  useEffect(() => {
    if (show) {
      sessionStorage.setItem('hasSeenIntro', 'true');
      const timer = setTimeout(() => {
        setShow(false);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 z-10">
            {/* Logo Mark Reveal */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center select-none"
            >
              <div className="absolute inset-0 border-[3px] border-accent/20 rounded-2xl rotate-45 transition-transform" />
              <div className="absolute inset-0 border-[3px] border-accent rounded-2xl -rotate-12 transition-transform" />
              <span className="font-display text-4xl md:text-5xl text-accent font-bold z-10 drop-shadow-[0_0_10px_rgba(37,99,235,0.7)]">⚡</span>
            </motion.div>

            {/* Typography Reveal */}
            <div className="flex flex-col items-center md:items-start overflow-hidden leading-none pb-2 select-none">
              <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="font-body text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tight font-extrabold drop-shadow-[0_0_20px_rgba(37,99,235,0.35)] flex items-center gap-0"
                >
                  SHOT
                  <svg 
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-[#38bdf8] drop-shadow-[0_0_25px_rgba(56,189,248,0.95)] animate-pulse fill-current mx-[-3px] md:mx-[-5px] mt-[-2px] md:mt-[-4px]" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Y HUB
                </motion.div>
              </div>
            </div>
          </div>

          {/* Subtitle & Line Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="overflow-hidden mt-8 flex flex-col items-center gap-4 w-full"
          >
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "250px", opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.4, ease: "easeInOut" }}
              className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent md:w-[400px]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
              className="text-text-secondary text-sm md:text-base font-body tracking-[0.3em] uppercase text-center"
            >
              Premium Video Editing
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

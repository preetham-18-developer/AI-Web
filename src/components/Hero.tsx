import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const WORDS = ["ATTENTION", "RETENTION", "CINEMATIC", "VIRAL SPEED ⚡"];

export const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const { scrollY } = useScroll();
  const timelineY = useTransform(scrollY, [0, 800], [0, -120]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWordIdx((prev) => (prev + 1) % WORDS.length);
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateOrbPosition = () => {
      setOrbPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.06),
        y: lerp(prev.y, mousePosition.y, 0.06),
      }));
      animationFrameId = requestAnimationFrame(updateOrbPosition);
    };

    animationFrameId = requestAnimationFrame(updateOrbPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition, isMobile]);

  return (
    <section id="home" className="relative min-h-[820px] md:min-h-screen py-16 md:py-24 flex flex-col items-center justify-center overflow-hidden pt-24 md:pt-28">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(96,165,250,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDIiIGhlaWdodD0iNDAyIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjM1Ii8+PC9zdmc+')] mix-blend-overlay" />
      </div>

      {/* Floating Orb */}
      <div
        className="absolute z-0 pointer-events-none rounded-full"
        style={{
          width: isMobile ? '200px' : '400px',
          height: isMobile ? '200px' : '400px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)',
          filter: 'blur(60px)',
          left: isMobile ? '50%' : orbPosition.x,
          top: isMobile ? '50%' : orbPosition.y,
          transform: 'translate(-50%, -50%)',
          transition: isMobile ? 'none' : 'none'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center pt-2 md:pt-4">
        {/* Top Content */}
        <div className="w-full flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block"
          >
            <span className="px-3 py-1 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30 backdrop-blur-sm">
              WORLD'S FIRST QUICK CONTENT SERVICE
            </span>
          </motion.div>

          <h1 className="mt-6 mb-4 flex flex-col space-y-2 items-center">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-[26px] md:text-[44px] leading-tight text-text-primary"
            >
              Cinematic AI Editing in
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black text-[38px] sm:text-[54px] md:text-[76px] lg:text-[88px] leading-none text-accent tracking-tight uppercase drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Less than 10 minutes*
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-body text-[15px] md:text-[18px] text-text-secondary max-w-[520px] leading-[1.7] mb-8"
          >
            India's most trusted AI video editor. Book a session, get cinematic reels — fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8"
          >
            <div className="flex flex-row space-x-4">
              <a
                href="#book"
                className="h-12 px-5 bg-accent rounded-lg font-body font-semibold text-[15px] text-white flex items-center justify-center hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-250 ease-out"
              >
                Book a Session →
              </a>
              <a
                href="#portfolio"
                className="h-12 px-5 bg-transparent border border-border rounded-lg font-body font-semibold text-[15px] text-text-primary flex items-center justify-center hover:border-accent hover:bg-accent-soft transition-all duration-250 ease-out"
              >
                See Portfolio
              </a>
            </div>
          </motion.div>
        </div>

        {/* Widescreen Interactive AI Video Editor Workspace */}
        <motion.div
          style={{ y: timelineY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
          className="mt-12 md:mt-16 w-full max-w-[90vw] md:max-w-[780px] lg:max-w-[840px] bg-[#0c0c0e]/85 backdrop-blur-[16px] border border-border rounded-[24px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] p-4 md:p-6 relative group overflow-hidden select-none hover:border-accent/40 transition-colors duration-500"
        >
          {/* Subtle horizontal light scanning beam across the panel */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-[marquee_4s_linear_infinite]" />

          {/* Console Header / Toolbar */}
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4 font-mono text-[10px] md:text-[11px] text-text-muted">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              <span className="text-text-secondary tracking-widest uppercase">SHOTZY AI: ACTIVE ENGINE</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-soft text-accent border border-accent/20">
                <span>SPEED:</span>
                <span className="font-semibold animate-pulse">10x ULTRA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="font-mono text-text-secondary font-semibold tracking-wider">00:10:00</span>
              </div>
            </div>
          </div>

          {/* Playback / Video Preview screen mockup */}
          <div className="relative w-full aspect-[21/9] md:aspect-[2.4] rounded-[16px] overflow-hidden bg-[#060608] border border-border/50 flex flex-col items-center justify-center p-4 mb-5 group-hover:brightness-105 transition-all duration-300">
            {/* Visual audio grid grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            {/* Kinetic Caption Overlay */}
            <div className="z-10 text-center relative max-w-[85%]">
              <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-accent/80 mb-2">Auto-Generated Subtitle</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWordIdx}
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="font-display font-extrabold text-[22px] md:text-[42px] leading-tight text-white tracking-wider filter drop-shadow-[0_0_15px_rgba(255,255,255,0.25)] select-none uppercase italic"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
                >
                  "{WORDS[activeWordIdx]}"
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Corner Badges inside preview screen */}
            <div className="absolute bottom-3 left-4 flex gap-1.5">
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-text-secondary">LUT_CINEMATIC_V2</span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-text-secondary">60FPS</span>
            </div>
          </div>

          {/* Timeline tracks container */}
          <div className="space-y-3.5 relative bg-[#070709] border border-border/60 rounded-[14px] p-3 md:p-4">
            
            {/* Glowing scrolling playhead line */}
            <motion.div 
              animate={{ left: ["4%", "96%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute top-0 bottom-0 w-[2px] bg-accent z-30 pointer-events-none"
              style={{ left: "4%" }}
            >
              <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_10px_rgba(37,99,235,1)] flex items-center justify-center border border-white" />
            </motion.div>

            {/* Track 1: Video segments */}
            <div className="relative flex items-center gap-2">
              <div className="w-[50px] md:w-[64px] font-mono text-[9px] text-text-secondary tracking-wider uppercase font-semibold">Video:</div>
              <div className="flex-1 grid grid-cols-12 gap-1.5 relative h-7 select-none">
                <div className="col-span-3 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center font-mono text-[9px] text-text-primary px-1 hover:bg-accent/30 transition-all cursor-pointer">
                  HOOK_01
                </div>
                <div className="col-span-6 rounded-md bg-[#131b2e] border border-border flex items-center justify-center font-mono text-[9px] text-text-secondary px-1 hover:border-accent/40 transition-all cursor-pointer">
                  STORYLINE_02
                </div>
                <div className="col-span-3 rounded-md bg-accent-soft border border-accent/25 flex items-center justify-center font-mono text-[9px] text-accent px-1 hover:bg-accent/20 transition-all cursor-pointer">
                  CTA_03
                </div>
              </div>
            </div>

            {/* Track 2: Animated Audio Sync Waveform */}
            <div className="relative flex items-center gap-2">
              <div className="w-[50px] md:w-[64px] font-mono text-[9px] text-text-secondary tracking-wider uppercase font-semibold">Audio:</div>
              <div className="flex-1 bg-surface-2/45 border border-border/40 rounded-md h-8 relative flex items-center px-3 overflow-hidden">
                {/* SVG soundwave lines pulsing */}
                <svg className="w-full h-full text-accent/50 group-hover:text-accent/70 transition-colors" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path 
                    d="M0,20 Q5,5 10,20 T20,20 T30,20 T40,5 T50,20 T60,20 T70,35 T80,20 T90,20 T100,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    className="animate-[pulse_1.5s_ease-in-out_infinite]"
                  />
                  <path 
                    d="M0,20 Q5,35 10,20 T20,20 T30,10 T40,20 T50,30 T60,20 T70,20 T80,5 T90,20 T100,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeDasharray="2 2"
                    className="opacity-70 animate-[pulse_2.2s_ease-in-out_infinite]"
                  />
                </svg>
              </div>
            </div>

            {/* Track 3: Captions / FX Triggers */}
            <div className="relative flex items-center gap-2">
              <div className="w-[50px] md:w-[64px] font-mono text-[9px] text-text-secondary tracking-wider uppercase font-semibold">FX / Cuts:</div>
              <div className="flex-1 grid grid-cols-10 gap-1.5 h-6 select-none">
                <div className="col-span-2 rounded bg-surface/50 border border-border/80 flex items-center justify-center font-mono text-[8px] text-text-muted hover:border-accent/30 cursor-pointer">
                  ✨ ZOOM
                </div>
                <div className="col-span-3 rounded bg-accent/10 border border-accent/30 flex items-center justify-center font-mono text-[8px] text-accent hover:bg-accent/20 cursor-pointer">
                  ⚡ SPEED
                </div>
                <div className="col-span-2 rounded bg-surface/50 border border-border/80 flex items-center justify-center font-mono text-[8px] text-text-muted hover:border-accent/30 cursor-pointer">
                  💥 GLITCH
                </div>
                <div className="col-span-3 rounded bg-accent-soft border border-accent/20 flex items-center justify-center font-mono text-[8px] text-text-secondary hover:border-accent/40 cursor-pointer">
                  🎵 BEAT_DROP
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

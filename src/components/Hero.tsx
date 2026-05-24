import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LiveCounter } from './LiveCounter';

export const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

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
    <section id="home" className="relative min-h-[700px] h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(232,98,42,0.08)_0%,transparent_60%)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(201,168,76,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDIiIGhlaWdodD0iNDAyIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjM1Ii8+PC9zdmc+')] mix-blend-overlay" />
      </div>

      {/* Floating Orb */}
      <div
        className="absolute z-0 pointer-events-none rounded-full"
        style={{
          width: isMobile ? '200px' : '400px',
          height: isMobile ? '200px' : '400px',
          background: 'radial-gradient(circle, rgba(232,98,42,0.15), transparent 70%)',
          filter: 'blur(60px)',
          left: isMobile ? '50%' : orbPosition.x,
          top: isMobile ? '50%' : orbPosition.y,
          transform: 'translate(-50%, -50%)',
          transition: isMobile ? 'none' : 'none'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="w-full md:w-3/5 md:pr-10 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block"
          >
            <span className="px-3 py-1 text-[11px] font-body tracking-[0.15em] uppercase border border-border rounded-full text-accent bg-surface/30 backdrop-blur-sm">
              AI Video Editor
            </span>
          </motion.div>

          <h1 className="mt-6 mb-4 flex flex-col space-y-2">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-[40px] md:text-[72px] leading-tight text-text-primary"
            >
              "Your Vision."
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-[40px] md:text-[72px] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-gold"
            >
              "Edited to Perfection."
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
            className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-8"
          >
            <div className="flex flex-row space-x-4">
              <a
                href="#book"
                className="h-12 px-5 bg-accent rounded-lg font-body font-semibold text-[15px] text-white flex items-center justify-center hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,98,42,0.3)] transition-all duration-250 ease-out"
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
            <LiveCounter />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center space-x-3 md:space-x-4 text-[12px] md:text-[13px] font-body text-text-secondary"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              200+ Reels Delivered
            </span>
            <span className="text-accent">·</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              50+ Happy Clients
            </span>
            <span className="text-accent">·</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              4.9★ Rating
            </span>
          </motion.div>
        </div>

        {/* Right Content - Desktop Only Mockup */}
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-2/5 pr-8 lg:pr-16 pointer-events-none">
          <div 
            className="relative w-full aspect-[9/16] max-h-[600px] border border-border bg-surface rounded-2xl shadow-2xl p-2 animate-[float_6s_ease-in-out_infinite] group transition-all duration-300 pointer-events-auto hover:scale-[1.02] hover:border-accent"
            style={{ animationPlayState: 'running' }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
          >
            <div className="w-full h-full rounded-xl overflow-hidden relative bg-surface-2 flex items-center justify-center group-hover:brightness-110 transition-all">
              {/* Fake reel placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent z-10 opacity-60"></div>
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                alt="AI Editing Sample" 
                className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
              />
              <div className="absolute z-20 w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-accent ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

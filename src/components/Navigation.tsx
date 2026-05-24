import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#0a0a0c]/85 backdrop-blur-[16px] saturate-[180%] ${scrolled ? 'border-b border-border' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[56px] md:h-[64px]">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="font-display text-[18px] text-text-primary">Salman AI Video Editing</a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="group relative font-body text-[14px] text-text-secondary tracking-[0.04em] hover:text-text-primary transition-colors duration-200"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-250 ease-out" />
              </a>
            ))}
            <a href="#book" className="ml-4 font-body font-semibold text-[14px] bg-accent text-white px-5 py-2.5 rounded-md hover:brightness-110 hover:shadow-[0_0_20px_rgba(232,98,42,0.3)] transition-all duration-300">
              Book a Session
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative w-10 h-10 text-text-primary focus:outline-none flex flex-col items-center justify-center gap-[5px]"
            >
              <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="block w-6 h-[2px] bg-current rounded-full" />
              <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2 }} className="block w-6 h-[2px] bg-current rounded-full" />
              <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="block w-6 h-[2px] bg-current rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-[56px] bg-[#0a0a0c]/97 z-40 flex flex-col px-6 pt-8 space-y-6"
          >
            {[...links, { name: 'Book a Session', href: '#book' }].map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, ease: "easeOut" }}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-display text-[24px] ${link.name === 'Book a Session' ? 'text-accent font-semibold mt-4' : 'text-text-primary'}`}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

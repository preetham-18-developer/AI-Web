import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial session check
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // Subscribe to Auth status changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  const links = [
    { name: 'Home', href: '#' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-200 bg-[#0a0a0c]/85 backdrop-blur-[16px] saturate-[180%] ${scrolled ? 'border-b border-border' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[56px] md:h-[64px]">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="font-body text-[20px] font-extrabold text-text-primary tracking-wider select-none drop-shadow-[0_0_8px_rgba(37,99,235,0.25)] hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.45)] transition-all duration-300 flex items-center gap-0">
                SHOT
                <svg 
                  className="w-5 h-5 text-[#38bdf8] drop-shadow-[0_0_10px_rgba(56,189,248,0.95)] animate-pulse fill-current mx-[-1.5px] mt-[-1px]" 
                  viewBox="0 0 24 24"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Y HUB
              </a>
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
              <a href="#book" className="font-body font-semibold text-[14px] bg-accent text-white px-5 py-2.5 rounded-md hover:brightness-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300">
                Book a Session
              </a>

              {/* Auth button or profile dropdown */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full bg-accent-soft border border-accent/30 text-accent font-semibold text-[14.5px] flex items-center justify-center cursor-pointer hover:border-accent transition-all select-none uppercase tracking-wider"
                  >
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2.5 w-52 bg-[#0c0c0e]/95 border border-border/80 rounded-xl shadow-2xl p-1.5 z-50 overflow-hidden backdrop-blur-md"
                        >
                          <div className="px-3.5 py-2 border-b border-border/40 font-body text-[12px] text-text-secondary truncate select-none leading-relaxed">
                            Client Account <br />
                            <span className="text-text-primary font-semibold">{user.user_metadata?.full_name || user.email}</span>
                          </div>
                          <button 
                            onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                            className="w-full text-left font-body text-[13px] text-text-primary hover:bg-surface-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer mt-1.5"
                          >
                            My Profile & Bookings
                          </button>
                          <button 
                            onClick={handleSignOut}
                            className="w-full text-left font-body text-[13px] text-danger hover:bg-danger/10 px-3.5 py-2 rounded-lg transition-colors cursor-pointer mt-1.5 border-t border-border/20 pt-1.5"
                          >
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="font-body font-medium text-[14px] text-text-secondary hover:text-text-primary cursor-pointer border border-border/60 px-4 py-2 rounded-md hover:border-accent hover:bg-accent-soft transition-all"
                >
                  Sign In
                </button>
              )}
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
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-[56px] bg-bg z-[55] flex flex-col px-6 pt-8 space-y-6"
          >
            {[
              ...links, 
              { name: 'Book a Session', href: '#book' },
              ...(user ? [
                { name: 'My Profile & Bookings', href: '/profile', isProfile: true },
                { name: 'Sign Out', href: '#logout', isLogout: true }
              ] : [
                { name: 'Sign In', href: '/login', isLogin: true }
              ])
            ].map((link: { name: string; href?: string; isLogout?: boolean; isLogin?: boolean; isProfile?: boolean }, i) => (
              <motion.a
                key={link.name}
                href={link.isLogout || link.isLogin || link.isProfile ? undefined : link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.isLogout) {
                    e.preventDefault();
                    handleSignOut();
                  } else if (link.isLogin) {
                    e.preventDefault();
                    navigate('/login');
                  } else if (link.isProfile) {
                    e.preventDefault();
                    navigate('/profile');
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, ease: "easeOut" }}
                className={`font-display text-[24px] cursor-pointer ${link.name === 'Book a Session' ? 'text-accent font-semibold mt-4' : link.isLogout ? 'text-danger' : 'text-text-primary'}`}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

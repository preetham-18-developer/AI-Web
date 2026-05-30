import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Password Visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const navigate = useNavigate();

  // Check if already authenticated, redirect
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || 'Google Authentication failed.', 'error');
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!email || !password) {
      showToast('Please fill in all credentials.', 'error');
      return;
    }

    if (isSignUp) {
      if (!fullName || !phone || !confirmPassword) {
        showToast('All fields are required for Sign Up.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }
    }

    try {
      setIsLoading(true);

      if (isSignUp) {
        // Sign Up Flow
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            }
          }
        });

        if (error) throw error;
        
        showToast('Account created successfully! Check your email for confirmation link.', 'success');
        
        // Clear inputs
        setFullName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Timeout to toggle view
        setTimeout(() => setIsSignUp(false), 2000);
      } else {
        // Check if admin is logging in
        if (email.toLowerCase() === 'admin@example.com') {
          const API_URL = import.meta.env.VITE_API_BASE_URL || '';
          const res = await axios.post(`${API_URL}/api/admin/login`, 
            { email, password },
            { withCredentials: true }
          );

          if (!res.data.success) {
            throw new Error(res.data.error || 'Admin login failed');
          }

          showToast('Admin logged in successfully! Redirecting to Dashboard...', 'success');
          setTimeout(() => navigate('/admin'), 1200);
          return;
        }

        // Sign In Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        showToast('Logged in successfully!', 'success');
        setTimeout(() => navigate('/'), 1200);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg || 'Authentication action failed. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background neon gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.06),transparent_60%)] -top-1/4 -left-1/4" />
        <div className="absolute w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.05),transparent_55%)] -bottom-1/4 -right-1/4" />
      </div>

      {/* Floating back button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 font-body text-[14px] text-text-secondary hover:text-text-primary group transition-colors duration-200 z-10"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      {/* Glassmorphic Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[450px] bg-[#0c0c0e]/80 backdrop-blur-[20px] border border-border/80 rounded-[28px] p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Glowing border scan line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* Card Header Branding */}
        <div className="text-center mb-8 select-none">
          <a href="#" className="font-body text-[26px] font-extrabold text-text-primary tracking-wider inline-flex items-center gap-0 select-none drop-shadow-[0_0_8px_rgba(37,99,235,0.25)] hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.45)] transition-all duration-300">
            SHOT
            <svg 
              className="w-6.5 h-6.5 text-[#38bdf8] drop-shadow-[0_0_10px_rgba(56,189,248,0.95)] animate-pulse fill-current mx-[-2px] mt-[-1px]" 
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Y HUB
          </a>
          <p className="font-body text-[13px] text-text-secondary mt-2">
            {isSignUp ? 'Join Shotzy Hub and get reels in 10 minutes' : 'Access your client dashboard'}
          </p>
        </div>

        {/* Switch Sign In / Sign Up Mode selector */}
        <div className="grid grid-cols-2 bg-surface/50 border border-border/40 rounded-xl p-1 mb-8">
          <button
            onClick={() => { setIsSignUp(false); setToast(null); }}
            className={`py-2 rounded-lg font-body text-[14px] font-medium transition-all duration-300 ${!isSignUp ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setToast(null); }}
            className={`py-2 rounded-lg font-body text-[14px] font-medium transition-all duration-300 ${isSignUp ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Full Name */}
                <div>
                  <label className="block font-body text-[12px] text-text-secondary mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Client Name"
                      className="w-full h-11 bg-surface border border-border/60 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] rounded-xl pl-10 pr-4 font-body text-[14px] text-text-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-body text-[12px] text-text-secondary mb-1.5 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full h-11 bg-surface border border-border/60 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] rounded-xl pl-10 pr-4 font-body text-[14px] text-text-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Email Address */}
          <div>
            <label className="block font-body text-[12px] text-text-secondary mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full h-11 bg-surface border border-border/60 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] rounded-xl pl-10 pr-4 font-body text-[14px] text-text-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Password with Eye mask */}
          <div>
            <label className="block font-body text-[12px] text-text-secondary mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-surface border border-border/60 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] rounded-xl pl-10 pr-11 font-body text-[14px] text-text-primary outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-2/40 transition-colors"
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>

          {/* Confirm Password in Sign Up */}
          <AnimatePresence>
            {isSignUp ? (
              <motion.div
                key="confirm-password-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div>
                  <label className="block font-body text-[12px] text-text-secondary mb-1.5 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-11 bg-surface border border-border/60 focus:border-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] rounded-xl pl-10 pr-11 font-body text-[14px] text-text-primary outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-2/40 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-accent hover:brightness-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)] text-white font-body font-semibold text-[14px] rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-5 items-center select-none">
          <div className="flex-grow border-t border-border/40"></div>
          <span className="flex-shrink mx-4 font-body text-[11px] text-text-muted uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-border/40"></div>
        </div>

        {/* Google OAuth Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-11 bg-surface-2 border border-border hover:border-accent hover:bg-accent-soft text-text-primary font-body font-semibold text-[14px] rounded-xl flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
        >
          {/* Custom inline Google SVG Logo */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 12.99a5.53 5.53 0 0 1 5.59-5.53c2.44 0 4.29 1.488 5.158 3.518l3.638-2.825C20.655 4.743 17.57 2.66 13.99 2.66c-5.176 0-9.39 4.214-9.39 9.39s4.214 9.39 9.39 9.39c5.176 0 8.92-3.642 8.92-9.043 0-.616-.062-1.127-.145-1.503L12.24 10.285Z"
            />
            <path
              fill="#FBBC05"
              d="M3.926 7.425a9.347 9.347 0 0 0-.266 5.565L7.298 10.16a5.525 5.525 0 0 1 .267-2.735L3.926 7.425Z"
            />
            <path
              fill="#4285F4"
              d="M13.99 18.514c-1.488 0-2.756-.777-3.488-1.925l-3.638 2.825a9.38 9.38 0 0 0 7.126 3.246c3.58 0 6.666-2.083 7.788-5.495l-3.638-2.825a5.536 5.536 0 0 1-4.15 4.174Z"
            />
            <path
              fill="#34A853"
              d="M13.99 5.486c1.558 0 2.85.833 3.556 2.053l3.638-2.825A9.379 9.379 0 0 0 13.99 2.66C10.41 2.66 7.324 4.743 6.202 8.155l3.638 2.825c.677-1.396 2.05-2.27 3.65-2.27a5.525 5.525 0 0 1 4.056 1.83l3.056-3.055a9.324 9.324 0 0 0-7.112-3.26L13.99 5.486Z"
            />
          </svg>
          Continue with Google
        </button>
      </motion.div>

      {/* Auth Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl font-body text-[13.5px] font-medium border flex items-center space-x-3
              ${toast.type === 'error' ? 'bg-[#2A1111] border-danger/30 text-danger' : 'bg-[#112A18] border-success/30 text-success'}
            `}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-[18px] h-[18px] text-danger" />
            ) : (
              <CheckCircle2 className="w-[18px] h-[18px] text-success" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 opacity-70 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

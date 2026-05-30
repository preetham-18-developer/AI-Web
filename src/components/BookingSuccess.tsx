import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { Star, Send, AlertTriangle, CheckCircle } from 'lucide-react';

export const BookingSuccess = () => {
  const [showTick, setShowTick] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('id') || 'BKG-8472';
  const { date, time, plan, videoType, amount, name, description, email, isRequest = false } = location.state || {
    date: new Date(),
    time: '4:00 PM',
    plan: 'Growth – ₹3,999',
    videoType: 'Instagram Reel',
    amount: 3999,
    name: 'Customer',
    description: 'Cinematic AI video editing with transition cuts.',
    email: 'customer@example.com',
    isRequest: false
  };

  const formattedDate = date instanceof Date ? format(date, 'MMMM d, yyyy') : format(new Date(date), 'MMMM d, yyyy');
  
  // WhatsApp sharing message template including Description brief
  const whatsappMessage = isRequest
    ? `Hi Shotzy Hub, I just submitted a booking request!

*Booking Request Details:*
Name: ${name}
Date & Time: ${formattedDate} at ${time}
Plan: ${plan}
Video Type: ${videoType}
Booking ID: ${orderId}

*Project Brief / Description:*
${description}

Please review and accept my booking request so I can proceed with the payment!`
    : `Hi Shotzy Hub, I just booked a session!

*Booking Details:*
Name: ${name}
Date & Time: ${formattedDate} at ${time}
Plan: ${plan}
Video Type: ${videoType}
Amount Paid: ₹${amount}
Order ID: ${orderId}

*Project Brief / Description:*
${description}

Looking forward to it!`;

  const whatsappUrl = `https://wa.me/917893287376?text=${encodeURIComponent(whatsappMessage)}`;

  // Feedback/Review state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      await axios.post(`${API_URL}/api/feedback`, {
        name,
        email: email || 'customer@example.com',
        rating,
        comment
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Stagger the tick animation after circle draws
    const timer = setTimeout(() => setShowTick(true), 600);
    
    // Automatically open WhatsApp on load!
    const timerWhatsapp = setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerWhatsapp);
    };
  }, [whatsappUrl]);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 py-16 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(46,204,113,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
        {/* Animated Checkmark */}
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="4"
              initial={{ strokeDasharray: "290", strokeDashoffset: "290" }}
              animate={{ strokeDashoffset: "0" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            {showTick && (
              <motion.path
                d="M 30 50 L 45 65 L 70 35"
                fill="none"
                stroke="var(--color-success)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ strokeDasharray: "100", strokeDashoffset: "100" }}
                animate={{ strokeDashoffset: "0" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}
          </svg>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="font-display text-[28px] md:text-[34px] text-text-primary mb-1"
        >
          {isRequest ? "Booking Request Submitted!" : "Payment Successful!"}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="font-body text-[14px] text-text-secondary mb-6"
        >
          {isRequest ? `Request reference: #${orderId}` : `Transaction reference: #${orderId}`}
        </motion.p>

        {/* CRITICAL WARNING BOX - MANDATORY WHATSAPP MESSAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className={`w-full border rounded-2xl p-5 mb-6 text-left relative overflow-hidden ${
            isRequest 
              ? 'bg-[#1e1c14]/90 border-amber-500/30 text-amber-200' 
              : 'bg-[#3d1313]/90 border border-danger/45 text-text-primary'
          }`}
        >
          <div className="flex gap-3.5 items-start">
            <div className={`p-2 border rounded-xl mt-0.5 shrink-0 ${
              isRequest 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                : 'bg-danger-soft border-danger/30 text-danger'
            }`}>
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className={`font-body font-black text-[14px] uppercase tracking-wider mb-1.5 leading-snug ${
                isRequest ? 'text-amber-500' : 'text-danger'
              }`}>
                {isRequest ? 'ACTION RECOMMENDED' : 'CRITICAL WARNING: ACTION REQUIRED'}
              </h4>
              <p className="font-body text-[13px] leading-[1.65]">
                {isRequest ? (
                  <>
                    You should click the green button below to send your booking details to the admin on WhatsApp. 
                    <strong className="block mt-2 font-extrabold">
                      Once the admin reviews and accepts your request, you can complete your payment in your Profile to fully secure the session slot.
                    </strong>
                  </>
                ) : (
                  <>
                    You <strong className="text-danger uppercase font-extrabold">MUST</strong> click the green button below to send your booking confirmation and project description to the admin on WhatsApp. 
                    <strong className="block mt-2 text-danger font-extrabold uppercase">
                      ⚠️ IF YOU DO NOT SEND THIS MESSAGE, YOUR SESSION WILL NOT BE CONSIDERED BOOKED OR VALID!
                    </strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Booking specifications details card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3 }}
          className="w-full bg-surface border border-border/80 rounded-2xl p-5 mb-6 text-left"
        >
          <div className="space-y-3 font-body text-[13.5px]">
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-text-secondary">Client Name</span>
              <span className="text-text-primary font-semibold">{name}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-text-secondary">Session Schedule</span>
              <span className="text-text-primary">{formattedDate} · {time}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-text-secondary">Plan Selected</span>
              <span className="text-text-primary">{plan}</span>
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-text-secondary mb-1">Project Brief Brief:</span>
              <p className="text-text-primary leading-relaxed text-[12.5px] italic max-h-[80px] overflow-y-auto">
                "{description}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main WhatsApp Trigger button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full flex flex-col gap-4 mb-10"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] text-white font-body font-black text-[14.5px] tracking-wide py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2.5 uppercase"
          >
            <Send className="w-4 h-4" />
            Send Details via WhatsApp
          </a>

          {isRequest && (
            <button
              onClick={() => navigate('/profile')}
              className="w-full h-12 bg-accent/25 hover:bg-accent hover:text-white border border-accent/40 text-accent font-body font-semibold text-[13.5px] rounded-xl flex items-center justify-center transition-all"
            >
              Track on My Profile Page →
            </button>
          )}

          <button 
            onClick={() => navigate('/')}
            className="font-body text-[13px] text-text-secondary hover:text-text-primary hover:underline transition-colors"
          >
            Go Back to Homepage
          </button>
        </motion.div>

        {/* Dynamic Star Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="w-full bg-[#0c0c0e]/85 backdrop-blur-[15px] border border-border/80 rounded-2xl p-6 text-left shadow-[0_15px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {!feedbackSubmitted ? (
              <motion.form 
                key="feedback-form"
                onSubmit={handleFeedbackSubmit}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-display font-semibold text-[17px] text-text-primary flex items-center gap-2">
                    <Star className="w-[18px] h-[18px] text-accent animate-pulse" />
                    How was your booking experience?
                  </h4>
                  <p className="font-body text-[12px] text-text-secondary mt-1">
                    Rate us like Amazon reviews! Help other clients find us.
                  </p>
                </div>

                {/* Stars selector */}
                <div className="flex gap-2 py-1 select-none">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLit = hoverRating !== null ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 cursor-pointer transition-transform duration-150 hover:scale-125"
                      >
                        <Star 
                          className={`w-7 h-7 transition-colors ${isLit ? 'fill-yellow-500 text-yellow-500' : 'text-text-muted fill-transparent'}`} 
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Comment input */}
                <div>
                  <label className="block font-body text-[11px] text-text-secondary mb-1">Written Feedback (Optional)</label>
                  <textarea
                    rows={2.5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked, how fast the payment was, etc..."
                    className="w-full bg-surface border border-border/60 focus:border-accent rounded-xl p-3 font-body text-[13px] text-text-primary outline-none resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 bg-accent hover:brightness-110 text-white font-body font-semibold text-[13px] rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="feedback-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 flex flex-col items-center justify-center space-y-3"
              >
                <CheckCircle className="w-12 h-12 text-success" />
                <h4 className="font-display font-semibold text-[18px] text-text-primary">
                  Thank You for Your Feedback!
                </h4>
                <p className="font-body text-[13px] text-text-secondary max-w-sm">
                  Your star review has been submitted successfully and will help us improve our AI editing platform.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

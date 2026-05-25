import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

export const BookingSuccess = () => {
  const [showTick, setShowTick] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('id') || 'BKG-8472';
  const { date, time, plan, videoType, amount, name } = location.state || {
    date: new Date(),
    time: '4:00 PM',
    plan: 'Growth – ₹3,999',
    videoType: 'Instagram Reel',
    amount: 3999,
    name: 'Customer'
  };

  const formattedDate = date instanceof Date ? format(date, 'MMMM d, yyyy') : format(new Date(date), 'MMMM d, yyyy');
  
  const whatsappMessage = `Hi Salman, I just booked a session!

*Booking Details:*
Name: ${name}
Date & Time: ${formattedDate} at ${time}
Plan: ${plan}
Video Type: ${videoType}
Amount Paid: ₹${amount}
Order ID: ${orderId}

Looking forward to it!`;

  const whatsappUrl = `https://wa.me/917893287376?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    // Stagger the tick animation after circle draws
    const timer = setTimeout(() => setShowTick(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(46,204,113,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Animated Checkmark */}
        <div className="w-24 h-24 mx-auto mb-8 relative">
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
          transition={{ delay: 1.0 }}
          className="font-display text-[32px] md:text-[36px] text-text-primary mb-2"
        >
          Booking Confirmed!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="font-body text-[15px] text-text-secondary mb-8"
        >
          Your session has been successfully scheduled.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, type: "spring" }}
          className="bg-surface border border-border rounded-xl p-6 mb-8 text-left"
        >
          <div className="space-y-4 font-body text-[14px]">
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-text-secondary">Booking ID</span>
              <span className="text-text-primary font-mono">#{orderId.substring(0, 12)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-text-secondary">Date & Time</span>
              <span className="text-text-primary">{formattedDate} · {time}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-text-secondary">Video Type</span>
              <span className="text-text-primary">{videoType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount Paid</span>
              <span className="text-text-primary font-semibold">₹{amount.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Send Booking Details via WhatsApp →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

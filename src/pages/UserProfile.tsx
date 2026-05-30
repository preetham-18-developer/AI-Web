import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Send, 
  AlertTriangle, 
  ArrowLeft,
  History,
  ShieldCheck,
  CheckCircle,
  Video
} from 'lucide-react';
import { isBefore, parseISO, startOfDay } from 'date-fns';

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  video_type: string;
  date: string;
  time: string;
  description: string;
  status: string;
  created_at: string;
}

export const UserProfile = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<number | null>(null);
  
  const navigate = useNavigate();

  const getPriceFromPlan = (planString: string) => {
    const priceString = planString.split('₹')[1];
    return priceString ? parseInt(priceString.replace(/,/g, ''), 10) : 3999;
  };

  const handlePayNow = async (booking: Booking) => {
    try {
      setIsProcessingPayment(booking.id);
      
      const priceInRupees = getPriceFromPlan(booking.plan);
      const priceInPaise = priceInRupees * 100;

      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      
      // 1. Create Razorpay order
      const orderRes = await axios.post(`${API_URL}/api/create-order`, {
        amount: priceInPaise,
        planName: booking.plan,
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
      });

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.error || 'Failed to create order');
      }

      const { order_id, key } = orderRes.data.data;

      // 2. Open Razorpay Checkout modal
      const options = {
        key,
        amount: priceInPaise,
        currency: 'INR',
        name: 'SHOTZY HUB',
        description: booking.plan,
        order_id,
        prefill: {
          name: booking.name,
          email: booking.email,
          contact: `91${booking.phone}`,
        },
        theme: { color: '#E8622A' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (_response: any) => {
          try {
            // Update booking status in DB to PAID
            const updateRes = await axios.put(`${API_URL}/api/bookings/${booking.id}/payment-success`);
            if (updateRes.data.success) {
              showToast('Payment Successful! Session booking is now fully active.', 'success');
              
              // Automatically open WhatsApp details send after payment!
              const formattedDate = booking.date;
              const whatsappMessage = `Hi Shotzy Hub, I just completed payment for my session!

*Booking Details:*
Name: ${booking.name}
Date & Time: ${formattedDate} at ${booking.time}
Plan: ${booking.plan}
Video Type: ${booking.video_type}
Status: PAID (SECURED)
Order ID: BKG-${booking.id}

*Project Brief / Description:*
${booking.description}

Looking forward to it!`;

              const whatsappUrl = `https://wa.me/917893287376?text=${encodeURIComponent(whatsappMessage)}`;
              window.open(whatsappUrl, '_blank');
              
              // Refresh user bookings list
              const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .ilike('email', profile?.email || booking.email)
                .order('created_at', { ascending: false });

              if (!bookingsError && bookingsData) {
                setBookings(bookingsData);
              }

              // Auto refresh the page after 1.5 seconds to ensure UI updates cleanly
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          } catch (err) {
            console.error('Failed to update booking status after payment:', err);
            showToast('Payment recorded but failed to update status automatically. Please notify support.', 'error');
          } finally {
            setIsProcessingPayment(null);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(null);
          }
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on('payment.failed', (response: any) => {
        console.error('[Razorpay] Payment failed:', response.error);
        showToast('Payment failed. Please try again.', 'error');
        setIsProcessingPayment(null);
      });
      rzp.open();

    } catch (err) {
      console.error('Error initiating payment:', err);
      const msg = err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.';
      showToast(msg, 'error');
      setIsProcessingPayment(null);
    }
  };

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Get user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          showToast('Session expired. Please sign in.', 'error');
          setTimeout(() => navigate('/login'), 1200);
          return;
        }

        // Setup profile details
        setProfile({
          name: user.user_metadata?.full_name || 'Client Member',
          email: user.email || '',
          phone: user.user_metadata?.phone || 'No phone registered'
        });

        // Query bookings for this client
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .ilike('email', user.email || '')
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

      } catch (err) {
        console.error('Failed to load profile data:', err);
        const msg = err instanceof Error ? err.message : String(err);
        showToast(msg || 'Failed to load booking history.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Separate bookings into upcoming vs past history
  const today = startOfDay(new Date());

  const parseBookingDate = (dateStr: string): Date => {
    try {
      const parsed = parseISO(dateStr);
      if (!isNaN(parsed.getTime())) return parsed;
    } catch (e) {
      // fallback
    }
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) return parsed;
    } catch (e) {
      // fallback
    }
    return new Date(); // fallback to today
  };

  const upcomingBookings = bookings.filter((b) => {
    const bDate = parseBookingDate(b.date);
    const isFutureOrToday = !isBefore(bDate, today);
    const isUpcomingStatus = b.status === 'PAID' || b.status === 'APPROVED_PENDING_PAYMENT' || b.status === 'PENDING_APPROVAL';
    return isFutureOrToday && isUpcomingStatus;
  });

  const pastBookings = bookings.filter((b) => {
    const bDate = parseBookingDate(b.date);
    const isPast = isBefore(bDate, today);
    const isPastStatus = b.status === 'DECLINED' || (b.status !== 'PAID' && b.status !== 'APPROVED_PENDING_PAYMENT' && b.status !== 'PENDING_APPROVAL');
    return isPast || isPastStatus;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleWhatsAppSend = (booking: Booking) => {
    const formattedDate = booking.date;
    const whatsappMessage = `Hi Shotzy Hub, I am sending details for my upcoming session!

*Booking Details:*
Name: ${booking.name}
Date & Time: ${formattedDate} at ${booking.time}
Plan: ${booking.plan}
Video Type: ${booking.video_type}
Status: PAID
Order ID: BKG-${booking.id}

*Project Brief / Description:*
${booking.description}

Looking forward to it!`;

    const whatsappUrl = `https://wa.me/917893287376?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col pt-16 relative overflow-hidden select-none">
      {/* Dynamic background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04),transparent_60%)] -top-1/4 -left-1/4" />
        <div className="absolute w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.03),transparent_55%)] -bottom-1/4 -right-1/4" />
      </div>

      {/* Toolbar / Header */}
      <header className="relative z-10 w-full bg-[#0c0c0e]/80 border-b border-border/80 p-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-body text-[13px] text-text-secondary hover:text-text-primary group transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <a href="#" className="font-body text-[22px] font-extrabold text-text-primary tracking-wider select-none drop-shadow-[0_0_8px_rgba(37,99,235,0.25)] hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.45)] transition-all duration-300 flex items-center gap-0">
            SHOT
            <svg 
              className="w-5.5 h-5.5 text-[#38bdf8] drop-shadow-[0_0_10px_rgba(56,189,248,0.95)] animate-pulse fill-current mx-[-1.5px] mt-[-1px]" 
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Y HUB
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 relative z-10 flex flex-col gap-8">
        {isLoading ? (
          <div className="flex-1 min-h-[500px] flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: User Profile Card */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0c0c0e]/85 border border-border/80 rounded-[24px] p-6 shadow-2xl relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                
                {/* Profile Header (Avatar and Initials) */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-border/40">
                  <div className="w-20 h-20 bg-accent-soft border border-accent/20 rounded-full flex items-center justify-center text-accent text-[26px] font-display font-extrabold select-none shadow-[0_0_20px_rgba(37,99,235,0.1)] mb-4">
                    {getInitials(profile.name)}
                  </div>
                  <h3 className="font-display font-bold text-[20px] text-text-primary flex items-center gap-2">
                    {profile.name}
                    <ShieldCheck className="w-5 h-5 text-accent" />
                  </h3>
                  <span className="font-body text-[11px] text-accent font-semibold uppercase tracking-widest mt-1">Verified Client</span>
                </div>

                {/* Profile Information Fields */}
                <div className="py-6 space-y-4 font-body text-[13.5px]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface border border-border/60 rounded-xl text-text-secondary shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider">Email Address</span>
                      <span className="text-text-primary font-medium">{profile.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface border border-border/60 rounded-xl text-text-secondary shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-text-muted uppercase tracking-wider">Phone Number</span>
                      <span className="text-text-primary font-medium">{profile.phone}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Bookings & History */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Section 1: Upcoming/Current Booking */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-[18px] text-text-primary flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-accent" />
                  Upcoming Sessions & Active Bookings
                </h4>
                
                {upcomingBookings.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0c0c0e]/40 border border-border/30 rounded-2xl p-8 text-center text-text-secondary italic font-body text-[14px]"
                  >
                    You don't have any upcoming paid sessions booked. 
                    <button 
                      onClick={() => navigate('/#book')}
                      className="block mx-auto mt-4 px-5 py-2.5 bg-accent hover:brightness-110 text-white font-body font-semibold text-[13px] rounded-xl transition-all cursor-pointer not-italic shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    >
                      Book a Session Now
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => {
                      const isPending = booking.status === 'PENDING_APPROVAL';
                      const isApproved = booking.status === 'APPROVED_PENDING_PAYMENT';
                      const isPaid = booking.status === 'PAID';

                      return (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-[#0c0c0e]/85 border rounded-[24px] p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300 ${
                            isApproved 
                              ? 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.06)]' 
                              : isPending 
                              ? 'border-border/60' 
                              : 'border-border/80'
                          }`}
                        >
                          {/* Border Highlight Accent */}
                          <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent ${
                            isPaid ? 'text-success/40' : isApproved ? 'text-amber-500/40' : 'text-text-muted/20'
                          }`} />
                          
                          {/* Header Details */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-4 mb-4 gap-3">
                            <div>
                              <div className="font-display font-bold text-[17px] text-text-primary">{booking.plan}</div>
                              <div className="flex items-center gap-1.5 text-accent font-body text-[12.5px] mt-1 font-semibold">
                                <Video className="w-3.5 h-3.5" />
                                {booking.video_type}
                              </div>
                            </div>
                            
                            {/* Badges */}
                            {isPaid && (
                              <div className="px-3 py-1 rounded-full bg-success-soft border border-success/30 text-success font-body text-[11px] font-bold uppercase tracking-wider inline-flex w-fit items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Confirmed (Paid)
                              </div>
                            )}
                            {isApproved && (
                              <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 font-body text-[11px] font-bold uppercase tracking-wider inline-flex w-fit items-center gap-1 animate-pulse">
                                <Clock className="w-3.5 h-3.5" />
                                Approved (Unpaid)
                              </div>
                            )}
                            {isPending && (
                              <div className="px-3 py-1 rounded-full bg-surface-2 border border-border/60 text-text-secondary font-body text-[11px] font-bold uppercase tracking-wider inline-flex w-fit items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Pending Review
                              </div>
                            )}
                          </div>

                          {/* Specifications Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-[13px] font-body text-text-secondary">
                            <div className="flex items-center gap-2.5">
                              <Calendar className="w-[17px] h-[17px] text-accent" />
                              <span>Date: <strong className="text-text-primary font-medium">{booking.date}</strong></span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Clock className="w-[17px] h-[17px] text-accent" />
                              <span>Time Slot: <strong className="text-text-primary font-medium">{booking.time}</strong></span>
                            </div>
                          </div>

                          {/* Brief Brief */}
                          <div className="bg-surface/50 border border-border/50 rounded-xl p-3.5 mb-5 font-body text-[12.5px] leading-relaxed">
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">Your Video Brief:</span>
                            <p className="text-text-primary italic">"{booking.description}"</p>
                          </div>

                          {/* Action Warnings/Boxes */}
                          {isPaid && (
                            <div className="bg-[#3d1313]/90 border border-danger/45 rounded-xl p-4 mb-5 text-left flex gap-3 items-start">
                              <AlertTriangle className="w-4 h-4 text-danger animate-pulse shrink-0 mt-0.5" />
                              <p className="font-body text-[12px] text-text-primary leading-[1.6]">
                                <strong className="text-danger uppercase font-extrabold">ACTION REQUIRED:</strong> You must click below to submit this booking request to our editor on WhatsApp. Bookings are only considered fully active once details are received.
                              </p>
                            </div>
                          )}

                          {isApproved && (
                            <div className="bg-[#1e1c14]/90 border border-amber-500/30 rounded-xl p-4 mb-5 text-left flex gap-3 items-start">
                              <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse shrink-0 mt-0.5" />
                              <p className="font-body text-[12px] text-amber-200 leading-[1.6]">
                                <strong className="text-amber-500 uppercase font-extrabold">ACTION RECOMMENDED:</strong> Your slot request was approved by the editor! Click the <strong className="text-success uppercase">Pay Now</strong> button below to complete your payment and secure this slot.
                              </p>
                            </div>
                          )}

                          {isPending && (
                            <div className="bg-surface-2/40 border border-border/30 rounded-xl p-4 mb-5 text-left flex gap-3 items-start">
                              <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <p className="font-body text-[12.5px] text-text-secondary leading-[1.6]">
                                <strong className="text-text-primary font-bold uppercase">Status: Pending Approval.</strong> Our team is currently reviewing your requested slot. We will update it here as soon as it is accepted!
                              </p>
                            </div>
                          )}

                          {/* Trigger buttons */}
                          {isPaid && (
                            <button
                              onClick={() => handleWhatsAppSend(booking)}
                              className="w-full bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] text-white font-body font-black text-[13.5px] tracking-wide py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2.5 uppercase cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Send Details via WhatsApp
                            </button>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => handlePayNow(booking)}
                              disabled={isProcessingPayment === booking.id}
                              className="w-full bg-accent hover:brightness-110 hover:shadow-[0_0_20px_rgba(232,98,42,0.3)] text-white font-body font-black text-[13.5px] tracking-wide py-3.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2.5 uppercase cursor-pointer disabled:bg-surface-2 disabled:text-text-muted disabled:border disabled:border-border disabled:cursor-not-allowed"
                            >
                              {isProcessingPayment === booking.id ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing Payment...
                                </>
                              ) : (
                                "Pay Now & Secure Slot"
                              )}
                            </button>
                          )}

                          {isPending && (
                            <button
                              onClick={() => handleWhatsAppSend(booking)}
                              className="w-full bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] font-body font-semibold text-[13px] py-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Speed up Approval on WhatsApp
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Session Booking History */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-[18px] text-text-primary flex items-center gap-2.5">
                  <History className="w-5 h-5 text-accent" />
                  Booking & Session History
                </h4>

                <div className="overflow-x-auto bg-surface border border-border/80 rounded-2xl shadow-xl">
                  <table className="w-full text-left font-body text-[13px] whitespace-nowrap">
                    <thead>
                      <tr className="bg-surface-2/65 border-b border-border/50 text-text-muted font-semibold uppercase tracking-wider">
                        <th className="p-4">Session Date</th>
                        <th className="p-4">Plan & Package</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-text-secondary">
                      {pastBookings.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-text-muted italic">No past session bookings found.</td>
                        </tr>
                      ) : (
                        pastBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-surface-2/15 transition-colors">
                            <td className="p-4">
                              <div className="font-semibold text-text-primary">{b.date}</div>
                              <div className="text-[11px] text-text-muted mt-0.5">{b.time}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-text-primary">{b.plan}</div>
                              <div className="text-[11px] text-accent font-semibold mt-0.5">{b.video_type}</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider inline-block
                                ${b.status === 'PAID' ? 'bg-success-soft border border-success/30 text-success' : 'bg-text-muted/15 border border-border/20 text-text-secondary'}
                              `}>
                                {b.status === 'PAID' ? 'COMPLETED' : b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

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
              <svg className="w-[18px] h-[18px] text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ) : (
              <CheckCircle className="w-[18px] h-[18px] text-success" />
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

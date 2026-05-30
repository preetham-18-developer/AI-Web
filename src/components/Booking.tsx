import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay 
} from 'date-fns';

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number. Please enter 10 digits starting with 6-9"),
  selectedPlan: z.string().min(1, "Please select a plan"),
  videoType: z.enum(["Instagram Reel", "YouTube Short", "Brand Promo Video", "AI Avatar Video", "Other"]),
  description: z.string().min(20, "Please provide more details (min 20 characters)").max(500, "Maximum 500 characters"),
});

type FormData = z.infer<typeof schema>;

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
];

// Mock capacity for demonstration
const TEAM_CAPACITY = 3;
const MOCK_BOOKINGS: Record<string, number> = {};

export const Booking = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      selectedPlan: "Hourly Plan – ₹1,999"
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const descriptionValue = watch("description") || "";

  useEffect(() => {
    const handleSelectPlan = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setValue("selectedPlan", customEvent.detail, { shouldValidate: true });
      }
    };
    window.addEventListener('selectPlan', handleSelectPlan);
    return () => window.removeEventListener('selectPlan', handleSelectPlan);
  }, [setValue]);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    if (isBefore(day, startOfDay(new Date()))) return;
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <button type="button" onClick={prevMonth} className="text-text-secondary hover:text-text-primary p-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className="font-display text-[20px] text-text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button type="button" onClick={nextMonth} className="text-text-secondary hover:text-text-primary p-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EE";
    const days = [];
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-body text-[13px] text-text-muted mb-4 uppercase">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const isPast = isBefore(day, startOfDay(new Date()));
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
            className={`
              relative flex justify-center items-center w-10 h-10 md:w-11 md:h-11 mx-auto rounded-lg text-sm font-body cursor-pointer transition-all duration-200
              ${!isSameMonth(day, monthStart) ? "text-transparent pointer-events-none" : ""}
              ${isPast && isSameMonth(day, monthStart) ? "text-text-muted cursor-not-allowed pointer-events-none" : ""}
              ${!isPast && isSameMonth(day, monthStart) && !isSelected ? "text-text-secondary hover:bg-surface-2" : ""}
              ${isSelected ? "bg-accent text-white font-semibold" : ""}
            `}
          >
            {formattedDate}
            {isToday && !isSelected && (
              <span className="absolute bottom-1 w-1 h-1 bg-accent rounded-full"></span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-y-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="mt-8 pt-8 border-t border-border overflow-hidden"
      >
        <h4 className="font-body font-semibold text-[15px] text-text-primary mb-4 flex justify-between items-center">
          Available Slots
          <span className="text-[13px] font-normal text-text-secondary">{format(selectedDate, 'MMMM d, yyyy')}</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TIME_SLOTS.map((time) => {
            const dateKey = `${format(selectedDate, 'yyyy-MM-dd')}-${time}`;
            const bookedCount = MOCK_BOOKINGS[dateKey] || 0;
            const isFullyBooked = bookedCount >= TEAM_CAPACITY;
            const isSelected = selectedTime === time;

            return (
              <button
                type="button"
                key={time}
                disabled={isFullyBooked}
                onClick={() => setSelectedTime(time)}
                className={`
                  relative h-12 rounded-lg border font-body text-[14px] transition-all duration-200
                  ${isFullyBooked ? 'border-transparent bg-surface text-text-muted line-through cursor-not-allowed' : ''}
                  ${!isFullyBooked && !isSelected ? 'border-border text-text-secondary hover:border-accent hover:bg-accent-soft' : ''}
                  ${isSelected ? 'border-accent bg-accent text-white font-semibold shadow-[0_0_15px_rgba(232,98,42,0.2)]' : ''}
                `}
                title={isFullyBooked ? 'Fully Booked' : ''}
              >
                {time}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const getPriceFromPlan = (planString: string) => {
    const priceString = planString.split('₹')[1];
    return priceString ? parseInt(priceString.replace(/,/g, ''), 10) : 3999;
  };

  const onSubmit = async (formData: FormData) => {
    if (!selectedDate || !selectedTime) {
      showToast("Please select a date and time slot", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const priceInRupees = getPriceFromPlan(formData.selectedPlan); // e.g. 1999
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      const res = await axios.post(`${API_URL}/api/bookings`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        plan: formData.selectedPlan,
        video_type: formData.videoType,
        date: dateStr,
        time: selectedTime,
        description: formData.description,
        amount: priceInRupees,
        status: 'PENDING_APPROVAL'
      });

      if (!res.data.success) {
        throw new Error(res.data.error || 'Failed to submit booking request');
      }

      const bookingId = res.data.data?.id || `REQ-${Date.now()}`;

      navigate(`/booking-success?id=${bookingId}`, {
        state: {
          date: selectedDate,
          time: selectedTime,
          plan: formData.selectedPlan,
          videoType: formData.videoType,
          amount: priceInRupees,
          name: formData.fullName,
          description: formData.description,
          email: formData.email,
          isRequest: true
        }
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('[onSubmit] Error:', err);
      showToast(
        err?.response?.data?.error || err.message || 'Something went wrong. Please try again.',
        'error'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-24 bg-bg border-t border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-[32px] md:text-[48px] text-text-primary mb-4">
            Book Your Session
          </h2>
          <p className="font-body text-text-secondary">
            Select an available time slot and secure your spot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Left Column: Calendar */}
          <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-6 md:p-8 h-fit">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <AnimatePresence>
              {renderTimeSlots()}
            </AnimatePresence>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-surface border border-border rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-[13px] text-text-secondary mb-2">Full Name</label>
                  <input
                    {...register("fullName")}
                    className={`w-full h-12 bg-surface-2 border ${errors.fullName ? 'border-danger' : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,98,42,0.12)]'} rounded-lg px-4 font-body text-[14px] text-text-primary outline-none transition-all duration-200`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="mt-1 font-body text-[12px] text-danger">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block font-body text-[13px] text-text-secondary mb-2">Email Address</label>
                  <input
                    {...register("email")}
                    className={`w-full h-12 bg-surface-2 border ${errors.email ? 'border-danger' : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,98,42,0.12)]'} rounded-lg px-4 font-body text-[14px] text-text-primary outline-none transition-all duration-200`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 font-body text-[12px] text-danger">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-[13px] text-text-secondary mb-2">Phone Number</label>
                  <input
                    {...register("phone")}
                    className={`w-full h-12 bg-surface-2 border ${errors.phone ? 'border-danger' : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,98,42,0.12)]'} rounded-lg px-4 font-body text-[14px] text-text-primary outline-none transition-all duration-200`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.phone && <p className="mt-1 font-body text-[12px] text-danger">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block font-body text-[13px] text-text-secondary mb-2">Selected Plan</label>
                  <div className="relative">
                    <select
                      {...register("selectedPlan")}
                      className={`w-full h-12 bg-surface-2 border ${errors.selectedPlan ? 'border-danger' : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,98,42,0.12)]'} rounded-lg px-4 font-body text-[14px] text-text-primary outline-none appearance-none transition-all duration-200`}
                    >
                      <option value="Hourly Plan – ₹1,999">Hourly Plan – ₹1,999</option>
                      <option value="Half Day Plan – ₹4,999">Half Day Plan – ₹4,999</option>
                      <option value="Full Event – ₹10,000">Full Event – ₹10,000</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errors.selectedPlan && <p className="mt-1 font-body text-[12px] text-danger">{errors.selectedPlan.message}</p>}
                </div>
              </div>

              <div>
                <label className="block font-body text-[13px] text-text-secondary mb-2">Type of Video</label>
                <div className="relative">
                  <select
                    {...register("videoType")}
                    className={`w-full h-12 bg-surface-2 border ${errors.videoType ? 'border-danger' : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,98,42,0.12)]'} rounded-lg px-4 font-body text-[14px] text-text-primary outline-none appearance-none transition-all duration-200`}
                  >
                    <option value="Instagram Reel">Instagram Reel</option>
                    <option value="YouTube Short">YouTube Short</option>
                    <option value="Brand Promo Video">Brand Promo Video</option>
                    <option value="AI Avatar Video">AI Avatar Video</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block font-body text-[13px] text-text-secondary">Brief / Description</label>
                  <span className="font-body text-[12px] text-text-muted">{descriptionValue.length}/500</span>
                </div>
                <textarea
                  {...register("description")}
                  rows={4}
                  className={`w-full bg-surface-2 border ${errors.description ? 'border-danger' : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,98,42,0.12)]'} rounded-lg p-4 font-body text-[14px] text-text-primary outline-none resize-none transition-all duration-200`}
                  placeholder="Tell us about the project, the vibe you're going for, reference links, etc."
                />
                {errors.description && <p className="mt-1 font-body text-[12px] text-danger">{errors.description.message}</p>}
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-accent-soft border border-accent/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="font-body text-[14px] text-text-primary">
                    <span className="text-text-secondary mr-2">Selected:</span>
                    {format(selectedDate, 'EEEE, d MMMM yyyy')} · {selectedTime}
                  </div>
                  <button type="button" onClick={() => setSelectedTime(null)} className="text-accent text-[13px] font-semibold hover:underline">Change</button>
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid || !selectedDate || !selectedTime || isSubmitting}
                className={`w-full h-[52px] rounded-lg font-body font-semibold text-[15px] flex items-center justify-center transition-all duration-300
                  ${!isValid || !selectedDate || !selectedTime || isSubmitting
                    ? 'bg-surface-2 text-text-muted border border-border cursor-not-allowed'
                    : 'bg-accent text-white hover:brightness-110 hover:shadow-[0_0_20px_rgba(232,98,42,0.3)]'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl font-body text-[14px] font-medium border flex items-center space-x-3
              ${toast.type === 'error' ? 'bg-[#2A1111] border-danger/30 text-danger' : 'bg-[#112A18] border-success/30 text-success'}
            `}
          >
            {toast.type === 'error' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 opacity-70 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

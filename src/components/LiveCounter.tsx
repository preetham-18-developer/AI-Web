import { useState, useEffect } from 'react';

export const LiveCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const res = await fetch(`${baseUrl}/api/stats/weekly-bookings`);
        const data = await res.json();
        if (data.success && typeof data.count === 'number') {
          setCount(data.count);
        } else {
          setCount(null);
        }
      } catch {
        setCount(null);
      }
    };
    fetchCount();
  }, []);

  if (count === null || count < 3) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-accent-soft border border-[rgba(232,98,42,0.2)] rounded-full px-[14px] py-[6px] animate-fade-in mt-4 lg:mt-0">
      <span className="w-2 h-2 rounded-full bg-accent animate-[livePulse_1.8s_ease-in-out_infinite]" />
      <span className="font-body text-[13px] text-text-secondary">
        {count === 1 ? '1 session booked this week' : `🔥 ${count} sessions booked this week`}
      </span>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

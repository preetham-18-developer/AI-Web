import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Eye, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  BarChart3, 
  DollarSign, 
  Calendar, 
  LogOut, 
  RefreshCw, 
  Clock, 
  MessageSquare,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface Reel {
  id: number;
  embed_url: string;
  label: string;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment?: string;
  is_active: number;
  created_at?: string;
}

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
}

interface Stats {
  uniqueViews: number;
  totalBookings: number;
  totalRevenue: number;
  loginHistory: { login_date: string; count: number }[];
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'reels' | 'feedback'>('analytics');
  
  // Edit reel state
  const [editingReels, setEditingReels] = useState<Record<number, { embedUrl: string, label: string }>>({});
  
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
  const navigate = useNavigate();

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      
      const [statsRes, bookingsRes, reelsRes, feedbacksRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/stats`, { withCredentials: true }),
        axios.get(`${API_URL}/api/admin/bookings`, { withCredentials: true }),
        axios.get(`${API_URL}/api/reels`),
        axios.get(`${API_URL}/api/admin/feedback`, { withCredentials: true })
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.data);
      if (reelsRes.data.success) {
        setReels(reelsRes.data.data);
        // Initialize editing state
        const editState: Record<number, { embedUrl: string, label: string }> = {};
        reelsRes.data.data.forEach((r: Reel) => {
          editState[r.id] = { embedUrl: r.embed_url, label: r.label };
        });
        setEditingReels(editState);
      }
      if (feedbacksRes.data.success) setFeedbacks(feedbacksRes.data.data);

    } catch (err) {
      const isAuthError = axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403);
      if (isAuthError) {
        showToast('Unauthorized session. Please login.', 'error');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        showToast(msg || 'Failed to fetch admin dashboard records.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      await axios.post(`${API_URL}/api/admin/logout`, {}, { withCredentials: true });
      showToast('Logged out successfully.', 'success');
      setTimeout(() => navigate('/'), 1200);
    } catch {
      showToast('Logout failed.', 'error');
    }
  };

  const handleUpdateReel = async (id: number) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const { embedUrl, label } = editingReels[id];
      
      const res = await axios.put(`${API_URL}/api/admin/reels`, {
        id,
        embed_url: embedUrl,
        label
      }, { withCredentials: true });

      if (res.data.success) {
        showToast('Reel links updated successfully!', 'success');
        fetchData(); // reload
      }
    } catch (err) {
      const errMsg = axios.isAxiosError(err) && err.response?.data?.error 
        ? err.response.data.error 
        : (err instanceof Error ? err.message : 'Failed to update reel link.');
      showToast(errMsg, 'error');
    }
  };

  const handleToggleFeedback = async (id: number, currentActive: number) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const nextActive = currentActive === 1 ? 0 : 1;
      
      const res = await axios.put(`${API_URL}/api/admin/feedback/toggle`, {
        id,
        is_active: nextActive
      }, { withCredentials: true });

      if (res.data.success) {
        showToast('Feedback status updated!', 'success');
        fetchData();
      }
    } catch {
      showToast('Failed to toggle feedback.', 'error');
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.delete(`${API_URL}/api/admin/feedback/${id}`, { withCredentials: true });
      if (res.data.success) {
        showToast('Feedback deleted successfully.', 'success');
        fetchData();
      }
    } catch {
      showToast('Failed to delete feedback.', 'error');
    }
  };

  const handleAcceptBooking = async (id: number) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.put(`${API_URL}/api/admin/bookings/${id}/accept`, {}, { withCredentials: true });
      if (res.data.success) {
        showToast('Booking request accepted! Client can now pay from their profile.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to accept booking request.', 'error');
    }
  };

  const handleDeclineBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to decline this booking request?')) return;
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.put(`${API_URL}/api/admin/bookings/${id}/decline`, {}, { withCredentials: true });
      if (res.data.success) {
        showToast('Booking request declined.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to decline booking request.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col pt-16 relative overflow-hidden select-none">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04),transparent_60%)] -top-1/4 -left-1/4" />
        <div className="absolute w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.03),transparent_55%)] -bottom-1/4 -right-1/4" />
      </div>

      {/* Toolbar / Header */}
      <header className="relative z-10 w-full bg-[#0c0c0e]/80 border-b border-border/80 p-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <span className="px-2.5 py-0.5 rounded-full bg-accent-soft border border-accent/25 font-mono text-[10px] text-accent font-bold uppercase tracking-widest">
              ADMIN PANEL
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <button 
              onClick={fetchData} 
              className="p-2 bg-surface border border-border/60 rounded-xl text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className="w-[17px] h-[17px]" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-danger-soft border border-danger/25 rounded-xl font-body text-[13px] font-semibold text-danger hover:bg-danger/20 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 relative z-10 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side Tab Navigation */}
        <aside className="w-full lg:w-56 shrink-0 flex flex-col gap-2">
          {[
            { id: 'analytics', label: 'Dashboard & Stats', icon: BarChart3 },
            { id: 'bookings', label: 'Bookings list', icon: Calendar },
            { id: 'reels', label: 'Reels manager', icon: Sparkles },
            { id: 'feedback', label: 'Feedback panel', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'analytics' | 'bookings' | 'reels' | 'feedback')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-[14px] font-medium transition-all duration-250 cursor-pointer ${isActive ? 'bg-accent text-white shadow-lg shadow-accent/15' : 'bg-[#0c0c0e]/40 border border-border/30 text-text-secondary hover:text-text-primary hover:border-border/60'}`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Right Side Content Body */}
        <section className="flex-1 bg-[#0c0c0e]/85 backdrop-blur-[15px] border border-border/80 rounded-[20px] p-5 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] min-h-[500px]">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center min-h-[400px]">
              <svg className="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Analytics & Stats */}
              {activeTab === 'analytics' && stats && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <h3 className="font-display font-semibold text-[20px] text-text-primary flex items-center gap-2">
                    <TrendingUp className="w-[20px] h-[20px] text-accent" />
                    Real-Time Performance Overview
                  </h3>

                  {/* Summary Metric cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    
                    {/* Unique Views */}
                    <div className="bg-surface border border-border/80 rounded-2xl p-5 relative overflow-hidden group hover:border-accent/35 transition-colors">
                      <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-accent-soft rounded-bl-3xl flex items-center justify-center text-accent">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="font-body text-[12px] text-text-secondary uppercase tracking-wider block mb-1">Unique Views</span>
                      <span className="font-mono text-[30px] font-bold text-text-primary">{stats.uniqueViews.toLocaleString()}+</span>
                    </div>

                    {/* Bookings volume */}
                    <div className="bg-surface border border-border/80 rounded-2xl p-5 relative overflow-hidden group hover:border-accent/35 transition-colors">
                      <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-accent-soft rounded-bl-3xl flex items-center justify-center text-accent">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="font-body text-[12px] text-text-secondary uppercase tracking-wider block mb-1">Session Bookings</span>
                      <span className="font-mono text-[30px] font-bold text-text-primary">{stats.totalBookings}</span>
                    </div>

                    {/* Revenue sum */}
                    <div className="bg-surface border border-border/80 rounded-2xl p-5 relative overflow-hidden group hover:border-accent/35 transition-colors">
                      <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-accent-soft rounded-bl-3xl flex items-center justify-center text-accent">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <span className="font-body text-[12px] text-text-secondary uppercase tracking-wider block mb-1">Total Revenue</span>
                      <span className="font-mono text-[30px] font-bold text-accent">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>

                  </div>

                  {/* Daily Logins counter */}
                  <div>
                    <h4 className="font-body font-semibold text-[14px] text-text-primary mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      Daily Login Activity Log (Last 7 Days)
                    </h4>
                    <div className="bg-surface border border-border/80 rounded-xl overflow-hidden">
                      <table className="w-full text-left font-body text-[13.5px]">
                        <thead>
                          <tr className="bg-surface-2/65 border-b border-border/50 text-text-muted font-semibold">
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5 text-right">Login Sessions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30 text-text-secondary">
                          {stats.loginHistory.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="p-4 text-center text-text-muted italic">No logins logged yet.</td>
                            </tr>
                          ) : (
                            stats.loginHistory.map((row: { login_date: string; count: number }) => (
                              <tr key={row.login_date} className="hover:bg-surface-2/20 transition-colors">
                                <td className="p-3.5 font-mono">{row.login_date}</td>
                                <td className="p-3.5 text-right font-mono font-semibold text-text-primary">{row.count}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 2: Bookings list */}
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-semibold text-[20px] text-text-primary">
                    Video Sessions & Booking Requests
                  </h3>

                  <div className="overflow-x-auto bg-surface border border-border/80 rounded-2xl">
                    <table className="w-full text-left font-body text-[13px] whitespace-nowrap">
                      <thead>
                        <tr className="bg-surface-2/65 border-b border-border/50 text-text-muted font-semibold uppercase tracking-wider">
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Selected Plan</th>
                          <th className="p-4">Time Slot</th>
                          <th className="p-4 font-body">Project Brief / Description</th>
                          <th className="p-4 text-center">Status & Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-text-secondary">
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-text-muted italic">No bookings logged yet.</td>
                          </tr>
                        ) : (
                          bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-surface-2/15 transition-colors align-top">
                              <td className="p-4">
                                <div className="font-semibold text-text-primary">{booking.name}</div>
                                <div className="text-[11.5px] text-text-muted mt-0.5">{booking.email}</div>
                                <div className="text-[11px] text-accent font-semibold mt-1">91{booking.phone}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-semibold text-text-primary">{booking.plan}</div>
                                <div className="text-[11.5px] text-accent font-medium mt-0.5">{booking.video_type}</div>
                              </td>
                              <td className="p-4 font-mono">
                                <div className="text-text-primary font-medium">{booking.date}</div>
                                <div className="text-[11.5px] text-text-muted mt-0.5">{booking.time}</div>
                              </td>
                              <td className="p-4 max-w-[240px] break-words whitespace-normal text-text-secondary leading-relaxed">
                                {booking.description}
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex flex-col items-center gap-2">
                                  <span className={`px-2.5 py-0.5 rounded-full font-body text-[10px] font-bold uppercase tracking-wider text-center block ${
                                    booking.status === 'PAID' 
                                      ? 'bg-success-soft border border-success/30 text-success' 
                                      : booking.status === 'APPROVED_PENDING_PAYMENT' 
                                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-500' 
                                      : booking.status === 'DECLINED' 
                                      ? 'bg-danger-soft border border-danger/30 text-danger' 
                                      : 'bg-surface-2 border border-border/50 text-text-secondary'
                                  }`}>
                                    {booking.status === 'PENDING_APPROVAL' ? 'PENDING REVIEW' : booking.status === 'APPROVED_PENDING_PAYMENT' ? 'APPROVED (UNPAID)' : booking.status || 'PENDING'}
                                  </span>

                                  {booking.status === 'PENDING_APPROVAL' && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <button
                                        onClick={() => handleAcceptBooking(booking.id)}
                                        className="px-2.5 py-1 bg-success/20 hover:bg-success hover:text-white border border-success/30 text-success font-body text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleDeclineBooking(booking.id)}
                                        className="px-2.5 py-1 bg-danger/20 hover:bg-danger hover:text-white border border-danger/30 text-danger font-body text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Reels links manager */}
              {activeTab === 'reels' && (
                <motion.div
                  key="reels"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-display font-semibold text-[20px] text-text-primary">
                      Dynamic Homepage Reels Editor
                    </h3>
                    <p className="font-body text-[13px] text-text-secondary mt-1">
                      Instantly change the embed URLs of the 6 portfolio reels displayed on the homepage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {reels.map((reel) => {
                      const id = reel.id;
                      const current = editingReels[id] || { embedUrl: '', label: '' };
                      return (
                        <div key={id} className="bg-surface border border-border/80 rounded-xl p-4 space-y-3.5 relative overflow-hidden group hover:border-accent/25 transition-colors">
                          <span className="absolute top-3.5 right-4 font-mono text-[10px] text-accent font-bold">REEL ID: #{id}</span>
                          
                          {/* Label input */}
                          <div>
                            <label className="block font-body text-[11px] text-text-secondary mb-1">Reel Title / Label</label>
                            <input 
                              type="text" 
                              value={current.label}
                              onChange={(e) => setEditingReels({
                                ...editingReels,
                                [id]: { ...current, label: e.target.value }
                              })}
                              className="w-full h-9 bg-surface-2 border border-border/60 focus:border-accent rounded-lg px-3 font-body text-[13px] text-text-primary outline-none transition-all"
                            />
                          </div>

                          {/* URL input */}
                          <div>
                            <label className="block font-body text-[11px] text-text-secondary mb-1">Instagram Embed URL</label>
                            <input 
                              type="text" 
                              value={current.embedUrl}
                              onChange={(e) => setEditingReels({
                                ...editingReels,
                                [id]: { ...current, embedUrl: e.target.value }
                              })}
                              className="w-full h-9 bg-surface-2 border border-border/60 focus:border-accent rounded-lg px-3 font-body text-[13px] text-text-primary outline-none transition-all font-mono"
                            />
                          </div>

                          <button
                            onClick={() => handleUpdateReel(id)}
                            className="w-full h-9 bg-accent-soft hover:bg-accent hover:text-white border border-accent/20 text-accent font-body font-semibold text-[13px] rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Apply Changes
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Feedback panel */}
              {activeTab === 'feedback' && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-semibold text-[20px] text-text-primary">
                    Client Star-Ratings Moderator
                  </h3>

                  <div className="overflow-x-auto bg-surface border border-border/80 rounded-2xl">
                    <table className="w-full text-left font-body text-[13px] whitespace-nowrap">
                      <thead>
                        <tr className="bg-surface-2/65 border-b border-border/50 text-text-muted font-semibold uppercase tracking-wider">
                          <th className="p-4">Client</th>
                          <th className="p-4">Stars</th>
                          <th className="p-4">Comment</th>
                          <th className="p-4">Moderation Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 text-text-secondary">
                        {feedbacks.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-text-muted italic">No feedbacks logged yet.</td>
                          </tr>
                        ) : (
                          feedbacks.map((item) => (
                            <tr key={item.id} className="hover:bg-surface-2/15 transition-colors align-middle">
                              <td className="p-4">
                                <div className="font-semibold text-text-primary">{item.name}</div>
                                <div className="text-[11.5px] text-text-muted mt-0.5">{item.email}</div>
                              </td>
                              <td className="p-4 font-bold text-accent font-mono text-[14px]">
                                {Array.from({ length: item.rating }).map((_, idx) => (
                                  <span key={idx} className="text-yellow-500 mr-0.5">★</span>
                                ))}
                              </td>
                              <td className="p-4 max-w-[280px] break-words whitespace-normal leading-relaxed">
                                {item.comment || <span className="text-text-muted italic">No comments</span>}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleToggleFeedback(item.id, item.is_active)}
                                    className={`flex items-center gap-1 font-body font-semibold text-[12px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${item.is_active === 1 ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-text-muted/15 text-text-secondary hover:bg-text-muted/25'}`}
                                  >
                                    {item.is_active === 1 ? (
                                      <>
                                        <ToggleRight className="w-4 h-4" />
                                        Approved (Active)
                                      </>
                                    ) : (
                                      <>
                                        <ToggleLeft className="w-4 h-4" />
                                        Inactive (Blocked)
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFeedback(item.id)}
                                    className="p-1.5 bg-danger-soft hover:bg-danger hover:text-white rounded-lg text-danger transition-colors cursor-pointer"
                                    title="Delete Review"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </section>

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

// CheckCircle2 fallback icon inside this page context to avoid compile errors if imported incorrectly
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={`${className} w-[18px] h-[18px]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

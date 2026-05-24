import { useState } from 'react';
import { motion } from 'framer-motion';

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes. In reality, this should call an API that sets an HttpOnly cookie.
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-[24px] text-text-primary mb-2">Admin Access</h1>
            <p className="font-body text-[14px] text-text-secondary">Please enter the admin password to continue.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full h-12 bg-surface-2 border ${error ? 'border-danger' : 'border-border focus:border-accent'} rounded-lg px-4 font-body text-[14px] text-text-primary outline-none transition-all`}
              />
              {error && <p className="mt-1 font-body text-[12px] text-danger">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-accent text-white font-body font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border h-16 flex items-center px-6">
        <h1 className="font-display text-[20px] text-text-primary">Admin Dashboard</h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="ml-auto text-text-secondary hover:text-text-primary font-body text-[14px]"
        >
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Bookings Table */}
        <section className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-body font-semibold text-[18px] text-text-primary">Recent Bookings</h2>
            <button className="px-4 py-2 border border-border rounded-lg text-[13px] font-body hover:border-accent hover:text-accent transition-colors">
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-[14px]">
              <thead className="bg-surface-2 text-text-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Booking ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-primary">
                <tr>
                  <td className="px-6 py-4 font-mono text-[13px]">#BKG-8472</td>
                  <td className="px-6 py-4">John Doe</td>
                  <td className="px-6 py-4">Jul 14, 2025 · 4:00 PM</td>
                  <td className="px-6 py-4">Instagram Reel</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success/10 text-success rounded-full text-[12px]">Paid</span>
                  </td>
                </tr>
                {/* More rows would go here */}
              </tbody>
            </table>
          </div>
        </section>

        {/* Portfolio Management */}
        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-body font-semibold text-[18px] text-text-primary mb-4">Portfolio Management</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Instagram Reel URL" 
              className="flex-1 h-10 bg-surface-2 border border-border rounded-lg px-4 font-body text-[14px] outline-none focus:border-accent"
            />
            <button className="px-6 h-10 bg-accent text-white rounded-lg font-body font-semibold hover:brightness-110 transition-all">
              Add Reel
            </button>
          </div>
        </section>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-surface border border-border rounded-xl p-6">
            <h2 className="font-body font-semibold text-[18px] text-text-primary mb-4">Team Capacity</h2>
            <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg border border-border">
              <div>
                <div className="font-body text-[14px] text-text-primary">Concurrent Bookings</div>
                <div className="font-body text-[12px] text-text-secondary">Number of editors available per slot</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center hover:border-accent">-</button>
                <span className="font-mono text-text-primary">3</span>
                <button className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center hover:border-accent">+</button>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

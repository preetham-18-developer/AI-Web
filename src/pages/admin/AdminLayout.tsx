import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/logout', {}, { withCredentials: true });
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { path: '/admin', label: '📊 Dashboard', exact: true },
    { path: '/admin/bookings', label: '📅 Bookings' },
    { path: '/admin/portfolio', label: '🎬 Portfolio' },
    { path: '/admin/pricing', label: '💰 Pricing' },
    { path: '/admin/team', label: '👥 Team' },
    { path: '/admin/settings', label: '⚙️ Settings' },
  ];

  const getPageTitle = () => {
    const item = navItems.find(item => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/admin');
    return item ? item.label.split(' ')[1] : 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0C', color: '#FFF' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: '#121214', borderRight: '1px solid #2A2A2D', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '16px', margin: 0 }}>Salman AI</h2>
          <span style={{ background: '#E8622A20', color: '#E8622A', padding: '4px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}>ADMIN PANEL</span>
        </div>
        
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(item => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'block', padding: '12px 16px', marginBottom: '4px', borderRadius: '8px',
                textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
                background: isActive ? '#E8622A15' : 'transparent',
                color: isActive ? '#E8622A' : '#AAA',
                borderLeft: isActive ? '3px solid #E8622A' : '3px solid transparent'
              }}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #2A2A2D' }}>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#888', marginBottom: '12px', wordBreak: 'break-all' }}>admin@salman.ai</div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(231,76,60,0.5)', color: '#E74C3C', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '20px', fontWeight: 600, margin: 0 }}>{getPageTitle()}</h1>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#AAA' }}>
            {time.toLocaleDateString()} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

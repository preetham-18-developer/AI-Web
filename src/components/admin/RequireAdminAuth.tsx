import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const RequireAdminAuth = () => {
  const [status, setStatus] = useState<'loading' | 'authed' | 'unauthed'>('loading');

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/me', { withCredentials: true })
      .then(() => setStatus('authed'))
      .catch(() => setStatus('unauthed'));
  }, []);

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0A0A0C'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  if (status === 'unauthed') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default RequireAdminAuth;

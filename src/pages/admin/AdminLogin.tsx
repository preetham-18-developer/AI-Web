import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (lockoutTimer > 0) {
      const t = setTimeout(() => setLockoutTimer(prev => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [lockoutTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3001/api/admin/login', { email, password }, { withCredentials: true });
      navigate('/admin');
    } catch (err: any) {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        if (newAttempts >= 3) {
          setLockoutTimer(60);
          return 0; // reset after lockout triggers
        }
        return newAttempts;
      });
      setError('Invalid email or password. Please try again.');
      // trigger shake animation via CSS class later
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0A0A0C', position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60%', height: '60%',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,98,42,0.06) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        background: '#121214', border: '1px solid #2A2A2D', borderRadius: '20px',
        padding: '48px', width: '400px', maxWidth: '90vw', zIndex: 1,
        animation: error ? 'shake 0.4s' : 'none'
      }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', textAlign: 'center', color: '#FFF', margin: 0 }}>Salman AI Video Editing</h1>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', marginTop: '4px' }}>Admin Access</p>
        
        <div style={{ borderTop: '1px solid #2A2A2D', margin: '24px 0' }} />

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#AAA', marginBottom: '8px' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
              style={{ width: '100%', background: '#1A1A1D', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#FFF', fontFamily: '"DM Sans", sans-serif' }}
            />
          </div>
          
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label style={{ display: 'block', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#AAA', marginBottom: '8px' }}>Password</label>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', background: '#1A1A1D', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#FFF', fontFamily: '"DM Sans", sans-serif' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '38px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#E74C3C', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {lockoutTimer > 0 ? (
            <div style={{ textAlign: 'center', color: '#E74C3C', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>
              Too many attempts. Please wait {lockoutTimer} seconds.
            </div>
          ) : (
            <button type="submit" disabled={loading}
              style={{ width: '100%', height: '48px', background: '#E8622A', borderRadius: '8px', border: 'none', color: '#FFF', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          )}
        </form>
      </div>

      <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', color: '#888', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', marginTop: '24px', cursor: 'pointer' }}>
        Back to website ←
      </button>
    </div>
  );
};

export default AdminLogin;

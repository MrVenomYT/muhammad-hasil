import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginSection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const target = (router.query.redirect && typeof router.query.redirect === 'string') 
        ? router.query.redirect 
        : '/admin/dashboard';
      router.replace(target);
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const target = (router.query.redirect && typeof router.query.redirect === 'string') 
        ? router.query.redirect 
        : '/admin/dashboard';
      router.replace(target);
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid admin credentials. Please double-check email and password.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@muhammadhasil.com');
    setPassword('admin123456');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', width: '100%' }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '44px 36px',
          backgroundColor: 'rgba(16, 14, 12, 0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 119, 0, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 119, 0, 0.15)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <img src="/assets/muhammad-hasil.png" alt="Muhammad Hasil" width="46" height="46" style={{ borderRadius: '50%', border: '2px solid #ff7700' }} />
          <span style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display, "Outfit", sans-serif)', color: '#fff', letterSpacing: '-0.5px' }}>Muhammad Hasil</span>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          Admin Login
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
          Access your portfolio management dashboard
        </p>

        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', color: '#fca5a5', fontSize: '13px', marginBottom: '20px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
          <div className="form-group" style={{ marginBottom: '18px', width: '100%', textAlign: 'left' }}>
            <label htmlFor="admin-email" style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Email</label>
            <input 
              id="admin-email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@muhammadhasil.com" 
              required 
              className="form-input" 
              style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px', width: '100%', textAlign: 'left' }}>
            <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input 
              id="admin-password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••••••" 
              required 
              className="form-input" 
              style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary" 
            style={{ 
              cursor: 'pointer', 
              border: 'none', 
              padding: '14px 24px', 
              borderRadius: '12px', 
              backgroundColor: '#ff7700', 
              color: '#fff', 
              fontWeight: 700, 
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(255, 119, 0, 0.45)'
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span> <span className="arrow">↗</span>
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              marginTop: '12px',
              backgroundColor: 'transparent',
              border: '1px dashed rgba(255, 119, 0, 0.35)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#ff7700',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Use Demo Admin Credentials (admin@muhammadhasil.com)
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link href="/" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

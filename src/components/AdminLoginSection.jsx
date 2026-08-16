import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/admin/dashboard');
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

  return (
    <div className="page-view active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          backgroundColor: 'rgba(20, 18, 16, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 119, 0, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <img src="/assets/muhammad-hasil.png" alt="Logo" width="42" height="42" style={{ borderRadius: '50%' }} />
          <span style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff' }}>iHasil Admin</span>
        </div>

        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
          Admin Login
        </h2>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '30px' }}>
          Access your portfolio management dashboard
        </p>

        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 68, 68, 0.15)', border: '1px solid rgba(255, 68, 68, 0.4)', borderRadius: '10px', color: '#ff6666', fontSize: '14px', marginBottom: '20px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="form-group" style={{ marginBottom: '20px', width: '100%', textAlign: 'left' }}>
            <label htmlFor="admin-email" style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px', fontWeight: '600' }}>Admin Email</label>
            <input 
              id="admin-email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@ihasil.com" 
              required 
              className="form-input" 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff' }} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px', width: '100%', textAlign: 'left' }}>
            <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px', fontWeight: '600' }}>Password</label>
            <input 
              id="admin-password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••••••" 
              required 
              className="form-input" 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff' }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary" 
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'} <span className="arrow">↗</span>
          </button>
        </form>
      </div>
    </div>
  );
}

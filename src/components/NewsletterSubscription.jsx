import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function NewsletterSubscription({ className = '' }) {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      const msg = 'Please enter a valid email address.';
      setStatus({ type: 'error', message: msg });
      showError(msg, 'Invalid Email');
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: data.message });
        showSuccess(data.message, 'Subscribed to Updates');
        setEmail('');
      } else {
        const errMsg = data.error || 'Failed to subscribe. Please try again.';
        setStatus({ type: 'error', message: errMsg });
        showError(errMsg, 'Subscription Notice');
      }
    } catch (err) {
      const netMsg = 'Network error. Please check your connection and retry.';
      setStatus({ type: 'error', message: netMsg });
      showError(netMsg, 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`newsletter-subscription-box ${className}`}
      style={{
        backgroundColor: '#18110c',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '36px 32px',
        maxWidth: '760px',
        margin: '0 auto',
        boxSizing: 'border-box',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange, #df6326)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          <Mail size={14} />
          <span>Audience & Project Updates</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display, "Syne", sans-serif)', fontSize: 'clamp(1.5rem, 3.2vw, 2rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          Subscribe for Full-Stack Updates & Insights
        </h3>

        <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '540px', margin: '0 auto', lineHeight: '1.6' }}>
          Receive notifications when new full-stack architectures, web applications, open-source repositories, and digital product releases are published to the database.
        </p>
      </div>

      {status.message && (
        <div 
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: status.type === 'success' ? '#10b981' : '#f87171'
          }}
        >
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
            <Mail size={18} />
          </div>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address (e.g. name@domain.com)"
            required
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#120c08',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '14px 16px 14px 44px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)'
            }}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: 'var(--accent-orange, #df6326)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(223, 99, 38, 0.35)',
            transition: 'background-color 0.2s ease, transform 0.15s ease',
            flex: '0 0 auto'
          }}
        >
          {loading ? (
            <span>Subscribing...</span>
          ) : (
            <>
              <span>Subscribe to Updates</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        Stored securely in MongoDB. No spam. One-click unsubscribe whenever you wish.
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = router.asPath || '/admin/dashboard';
      router.replace(`/admin/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          width: '100%',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '16px', 
          backgroundColor: '#120c08',
          color: '#ffffff',
          fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)'
        }}
      >
        <div 
          style={{ 
            width: '42px', 
            height: '42px', 
            border: '3px solid rgba(223, 99, 38, 0.2)', 
            borderTopColor: '#df6326', 
            borderRadius: '50%', 
            animation: 'spin 0.8s linear infinite' 
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
            Verifying Admin Authorization
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Secured via Firebase Authentication
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

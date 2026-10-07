import React from 'react';
import Link from 'next/link';

export default function Error({ statusCode }) {
  const is404 = statusCode === 404;

  return (
    <div 
      style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '60px 20px', 
        color: '#fff',
        textAlign: 'center'
      }}
    >
      <div 
        style={{
          maxWidth: '560px',
          backgroundColor: '#120f0d',
          border: '1px solid rgba(255, 119, 0, 0.25)',
          borderRadius: '20px',
          padding: '40px 28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ fontSize: '64px', fontWeight: 900, color: '#ff7700', marginBottom: '12px', lineHeight: 1 }}>
          {statusCode || 404}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px', color: '#ffffff' }}>
          {is404 ? 'Page or Project Not Found' : 'An Unexpected Error Occurred'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, margin: '0 0 28px' }}>
          {is404 
            ? 'The requested portfolio page or project could not be found. You can return to the portfolio showcase or browse all projects.'
            : 'A temporary server-side error occurred. Please refresh the page or return to the main portfolio.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/projects"
            style={{
              backgroundColor: '#ff7700',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            Explore Projects
          </Link>
          <Link
            href="/"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

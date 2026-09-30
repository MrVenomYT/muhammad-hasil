import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';

export default function PWAInstallButton({ compact = false }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed/standalone, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="pwa-install-btn"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 119, 0, 0.15)',
          color: '#ff7700',
          border: '1px solid rgba(255, 119, 0, 0.4)',
          borderRadius: '999px',
          padding: compact ? '6px 12px' : '7px 16px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 10px rgba(255, 119, 0, 0.2)'
        }}
        title="Install iHasil Web App to your device"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="pwa-install-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            padding: compact ? '6px 12px' : '7px 16px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
          title="Install on iPhone / iPad"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>Install Web App</span>
        </button>

        {showIOSGuide && (
          <div 
            onClick={() => setShowIOSGuide(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(12px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'rgba(20, 18, 16, 0.98)',
                border: '1px solid rgba(255, 119, 0, 0.4)',
                borderRadius: '20px',
                padding: '28px',
                maxWidth: '380px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 119, 0, 0.2)',
                color: '#ffffff',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <img src="/favicon-32x32.png" alt="iHasil" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>Install on iOS</h3>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                To pin this portfolio to your iPhone or iPad home screen:
              </p>
              <ol style={{ paddingLeft: '20px', margin: '0 0 24px 0', color: '#e2e8f0', fontSize: '13px', lineHeight: 1.8 }}>
                <li>Tap the <strong>Share</strong> button in the Safari bottom bar.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top-right corner.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#ff7700',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

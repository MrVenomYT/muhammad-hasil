'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link href="/" className="footer-brand" style={{ textDecoration: 'none' }}>
          <img src="/assets/muhammad-hasil.png" alt="iHasil Logo" className="brand-logo-img" />
          <span className="brand-logo-text">iHasil</span>
        </Link>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/muhammad-hasil/" target="_blank" rel="noopener noreferrer" className="footer-social-link" style={{ color: '#ffffff' }}>
            LinkedIn ↗
          </a>
          <a href="https://www.patreon.com/MrVenomYT" target="_blank" rel="noopener noreferrer" className="footer-social-link" style={{ color: '#ffffff' }}>
            Patreon ↗
          </a>
          <a href="https://pro.fiverr.com/users/venomdesigne613/" target="_blank" rel="noopener noreferrer" className="footer-social-link" style={{ color: '#ffffff' }}>
            Fiverr Pro ↗
          </a>
        </div>
        <p className="footer-copy" style={{ color: '#ffffff', opacity: 0.9 }}>© 2026 iHasil. All rights reserved.</p>
      </div>
    </footer>
  );
}

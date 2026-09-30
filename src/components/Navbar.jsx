import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import PWAInstallButton from './PWAInstallButton';

export default function Navbar() {
  const router = useRouter();
  const pathname = router ? router.pathname : '/';
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu whenever path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home', isExactHome: true },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/products', label: 'Products' },
    { href: '/services', label: 'Services' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="navbar">
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/muhammad-hasil.png" alt="iHasil" className="brand-logo-img" width="36" height="36" />
          <span className="brand-logo-text">iHasil</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-menu desktop-only-menu">
          {navLinks.map((link) => {
            const active = link.isExactHome 
              ? (isActive('/') && !pathname.includes('about') && !pathname.includes('projects') && !pathname.includes('products') && !pathname.includes('services') && !pathname.includes('contact') && !pathname.includes('admin'))
              : isActive(link.href);
            return (
              <Link key={link.href} href={link.href} className={`nav-link ${active ? 'active' : ''}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Primary Action Button & PWA Install */}
        <div className="nav-actions-zone" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PWAInstallButton compact={true} />

          {user ? (
            <Link href="/admin/dashboard" className="btn-secondary-nav" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#ff7700', border: '1px solid rgba(255, 119, 0, 0.3)', textDecoration: 'none', background: 'rgba(255, 119, 0, 0.1)' }}>
              ⚡ Dashboard
            </Link>
          ) : (
            <a href="https://pro.fiverr.com/users/venomdesigne613/" target="_blank" rel="noopener noreferrer" className="btn-primary-nav" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#ffffff', backgroundColor: '#ff7700', textDecoration: 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
              Hire me ↗
            </a>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle Button */}
        <button 
          className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile Navigation Drawer Backdrop */}
      <div 
        className={`nav-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <div className={`nav-mobile-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <Link href="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/assets/muhammad-hasil.png" alt="iHasil" className="brand-logo-img" width="32" height="32" />
            <span className="brand-logo-text">iHasil</span>
          </Link>
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map((link) => {
            const active = link.isExactHome 
              ? (isActive('/') && !pathname.includes('about') && !pathname.includes('projects') && !pathname.includes('products') && !pathname.includes('services') && !pathname.includes('faq') && !pathname.includes('contact') && !pathname.includes('admin'))
              : isActive(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`mobile-nav-link ${active ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <Link 
              href="/admin/dashboard" 
              className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`} 
              style={{ color: '#ff7700', fontWeight: 'bold' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              ⚡ Dashboard
            </Link>
          ) : (
            <Link 
              href="/admin/login" 
              className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`} 
              style={{ opacity: 0.8 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              🔒 Admin Login
            </Link>
          )}

          <div style={{ marginTop: '20px', padding: '0 8px' }}>
            <PWAInstallButton compact={false} />
          </div>
        </nav>
      </div>
    </>
  );
}


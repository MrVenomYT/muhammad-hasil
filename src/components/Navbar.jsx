import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

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
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="navbar">
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/muhammad-hasil.png" alt="iHasil Logo" className="brand-logo-img" width="36" height="36" />
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
          {user ? (
            <Link href="/admin/dashboard" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ color: '#ff7700', fontWeight: 'bold' }}>
              ⚡ Dashboard
            </Link>
          ) : (
            <Link href="/admin/login" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{ opacity: 0.8 }}>
              🔒 Admin
            </Link>
          )}
        </nav>

        {/* Desktop CTA Button */}
        <Link href="/contact" className="btn-primary btn-nav desktop-only-cta" style={{ textDecoration: 'none' }}>
          Start a Project <span className="arrow">↗</span>
        </Link>

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
            <img src="/assets/muhammad-hasil.png" alt="iHasil Logo" className="brand-logo-img" width="32" height="32" />
            <span className="brand-logo-text">iHasil</span>
          </Link>
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map((link) => {
            const active = link.isExactHome 
              ? (isActive('/') && !pathname.includes('about') && !pathname.includes('projects') && !pathname.includes('products') && !pathname.includes('services') && !pathname.includes('contact') && !pathname.includes('admin'))
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
        </nav>

        <div className="mobile-drawer-footer">
          <Link 
            href="/contact" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Start a Project <span className="arrow">↗</span>
          </Link>
        </div>
      </div>
    </>
  );
}


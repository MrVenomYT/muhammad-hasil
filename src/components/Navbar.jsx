import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../lib/usePortfolioData';
import GlobalSearchBar from './GlobalSearchBar';

export default function Navbar({ currentPath = '/' }) {
  let pathname = currentPath || '/';
  try {
    const router = useRouter();
    if (router?.pathname) {
      pathname = router.pathname;
    }
  } catch (e) {
    // Safe fallback during SSG
  }
  const { user } = useAuth();
  const { projects } = useProjects();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

        {/* Primary Action Button */}
        <div className="nav-actions-zone" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#cbd5e1',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Search Projects by Title or Tech Stack (Ctrl+K)"
            aria-label="Search Projects"
          >
            <Search size={14} style={{ color: 'var(--accent-orange, #df6326)' }} />
            <span style={{ fontSize: '12px' }}>Search</span>
            <kbd style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', color: '#94a3b8' }}>
              Ctrl K
            </kbd>
          </button>

          {user ? (
            <Link href="/admin/dashboard" className="btn-secondary-nav" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)', border: '1px solid var(--accent-primary-border)', textDecoration: 'none', background: 'var(--accent-primary-light)' }}>
              Dashboard
            </Link>
          ) : (
            <a href="https://pro.fiverr.com/users/venomdesigne613/" target="_blank" rel="noopener noreferrer" className="btn-primary-nav" style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#ffffff', backgroundColor: 'var(--accent-primary)', textDecoration: 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
              Hire me
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
            Close
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
              style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/admin/login" 
              className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`} 
              style={{ opacity: 0.8 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Login
            </Link>
          )}
        </nav>
      </div>

      {/* Global Search Bar Modal */}
      <GlobalSearchBar
        isModal={true}
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        projects={projects}
      />
    </>
  );
}


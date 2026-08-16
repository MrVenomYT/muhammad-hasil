import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = router ? router.pathname : '/';
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar">
      <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/assets/muhammad-hasil.png" alt="iHasil Logo" className="brand-logo-img" width="36" height="36" />
        <span className="brand-logo-text">iHasil</span>
      </Link>

      <nav className="nav-menu">
        <Link href="/" className={`nav-link ${isActive('/') && !pathname.includes('about') && !pathname.includes('projects') && !pathname.includes('products') && !pathname.includes('services') && !pathname.includes('contact') && !pathname.includes('admin') ? 'active' : ''}`}>
          Home
        </Link>
        <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
          About
        </Link>
        <Link href="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
          Projects
        </Link>
        <Link href="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
          Products
        </Link>
        <Link href="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>
          Services
        </Link>
        <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
          Contact
        </Link>
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

      <Link href="/contact" className="btn-primary btn-nav" style={{ textDecoration: 'none' }}>
        Start a Project <span className="arrow">↗</span>
      </Link>
    </header>
  );
}

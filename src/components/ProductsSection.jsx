import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCombinedProducts, seedProductsList } from '../lib/storage';
import { useProducts } from '../lib/usePortfolioData';
import { ProductCardSkeleton, GlobalLoadingBar } from './SkeletonLoader';

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

export default function ProductsSection({ initialProducts = [] }) {
  const { products: swrProducts, isLoading, isValidating } = useProducts(initialProducts);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = swrProducts && swrProducts.length > 0 ? swrProducts : seedProductsList;

  // Keyboard shortcut: close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Digital Asset')))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeTab === 'All' ? true : (p.category || '') === activeTab;
    const matchesSearch = searchQuery === '' ? true :
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(p.features) ? p.features.join(' ') : (p.features || '')).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="page-products" className="page-view active" style={{ paddingBottom: '90px' }}>
      <section className="projects-section">
        <div className="projects-header">
          <div className="section-tag">
            <span className="orange-dot"></span>
            <span>Digital Marketplace & Source Code</span>
          </div>
          <h2 className="section-title">Production Templates & SaaS Starters</h2>
          <p style={{ color: '#a1a1aa', maxWidth: '680px', margin: '0 0 24px 0', fontSize: '15px', lineHeight: 1.6 }}>
            Ready-to-deploy web applications, interactive React scheduling modules, and high-converting restaurant UI kits.
          </p>

          {/* Category Tabs & Search Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '32px' }}>
            <div className="projects-tabs-row" style={{ margin: 0 }}>
              {categories.map((cat) => {
                const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={`project-tab-btn ${activeTab === cat ? 'active' : ''}`}
                    onClick={() => setActiveTab(cat)}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search templates, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(20, 18, 16, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Products Grid, Skeleton Loading or Empty State */}
        {isLoading && products.length === 0 ? (
          <div className="products-grid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id || prod.id || prod.title}
                className="project-card"
              >
              <div>
                {/* Image Container with floating price & badge */}
                <div className="project-image-box">
                  <img
                    src={formatImageUrl(prod.imageUrl)}
                    alt={prod.title}
                    className="project-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/muhammad-hasil.png';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '13px',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    boxShadow: '0 4px 16px rgba(255, 119, 0, 0.45)',
                    fontFamily: 'monospace',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {prod.price || '$29'}
                  </div>
                  {prod.badge && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(12, 10, 9, 0.85)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}>
                      {prod.badge}
                    </div>
                  )}
                  <div className="project-overlay-link">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                      }}
                      className="btn-preview-quick"
                      style={{
                        backgroundColor: 'rgba(255, 119, 0, 0.25)',
                        border: '1px solid rgba(255, 119, 0, 0.7)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '12px',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(255, 119, 0, 0.35)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="project-info">
                  <div className="project-info-header">
                    <h3 className="project-title">{prod.title}</h3>
                    <span className="project-pill">{prod.category || 'Web Apps'}</span>
                  </div>
                  <p className="project-desc">{prod.description}</p>
                </div>
              </div>

              <div>
                {/* Feature tags */}
                {prod.features && prod.features.length > 0 && (
                  <div className="project-tech-tags" style={{ marginBottom: '14px' }}>
                    {prod.features.slice(0, 3).map((ft, idx) => (
                      <span key={idx} className="project-tech-tag">
                        · {ft}
                      </span>
                    ))}
                    {prod.features.length > 3 && (
                      <span className="project-tech-tag" style={{ color: '#ff7700' }}>
                        +{prod.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Card Actions Bar */}
                <div className="project-card-actions">
                  <a
                    href={prod.buyUrl || 'https://pro.fiverr.com/users/venomdesigne613/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-live-demo-text"
                  >
                    Get Template <span className="arrow">↗</span>
                  </a>

                  {prod.demoUrl && prod.demoUrl !== '#' ? (
                    <a
                      href={prod.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-details-text"
                    >
                      Live Demo ↗
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className="btn-details-text"
                    >
                      Specifications →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <p style={{ fontSize: '16px', margin: '0 0 12px 0' }}>No digital products found in this category.</p>
            <button
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              style={{ background: 'none', border: '1px solid rgba(255,119,0,0.4)', color: '#ff7700', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            >
              View All Products
            </button>
          </div>
        )}
      </section>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#12100e',
              border: '1px solid rgba(255, 119, 0, 0.3)',
              borderRadius: '24px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}
            >
              Close
            </button>

            <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }}>
              <img
                src={formatImageUrl(selectedProduct.imageUrl)}
                alt={selectedProduct.title}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '16px',
                padding: '6px 18px',
                borderRadius: '8px',
                fontFamily: 'monospace'
              }}>
                {selectedProduct.price || '$29'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {selectedProduct.category || 'Digital Asset'}
              </span>
              {selectedProduct.badge && (
                <>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {selectedProduct.badge}
                  </span>
                </>
              )}
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0', letterSpacing: '-0.5px' }}>
              {selectedProduct.title}
            </h2>

            <p style={{ color: '#d1d5db', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px 0' }}>
              {selectedProduct.description}
            </p>

            {/* Included Features */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <strong style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  What's Included in This Package
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  {selectedProduct.features.map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: '13px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>·</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal CTAs */}
            <div style={{ display: 'flex', gap: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
              <a
                href={selectedProduct.buyUrl || 'https://pro.fiverr.com/users/venomdesigne613/'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#ff7700',
                  color: '#ffffff',
                  padding: '12px 26px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(255, 119, 0, 0.4)'
                }}
              >
                Purchase & Download Source ↗
              </a>
              {selectedProduct.demoUrl && selectedProduct.demoUrl !== '#' && (
                <a
                  href={selectedProduct.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    padding: '12px 22px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  Live Interactive Demo ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SWR Background Syncing Indicator */}
      <GlobalLoadingBar active={isValidating} />
    </div>
  );
}

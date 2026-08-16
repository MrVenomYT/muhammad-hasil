import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const seedProductsList = [
  {
    id: 'prod-1',
    title: 'StayPilot Pro SaaS Starter',
    category: 'Web Apps',
    price: '$49',
    badge: 'Best Seller',
    description: 'Production-ready full-stack hotel & property management SaaS template built with React, Next.js, Firebase Auth & Stripe.',
    imageUrl: '/assets/StayPilot.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://stay-pilot-liard.vercel.app/',
    features: ['Next.js Pages Router', 'Firebase Realtime DB', 'Stripe Billing Integration', 'Responsive Dark UI']
  },
  {
    id: 'prod-2',
    title: 'VScheduler Booking Engine',
    category: 'Source Code',
    price: '$29',
    badge: 'Popular',
    description: 'Interactive appointment scheduling component with calendar synchronization, drag-drop slots, and automated email reminders.',
    imageUrl: '/assets/VScheduler.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://vscheduler-five.vercel.app/',
    features: ['Calendar Sync', 'EmailJS Reminders', 'Clean React Code', 'Full Customizability']
  },
  {
    id: 'prod-3',
    title: 'Sushiman Artisanal UI Kit',
    category: 'UI Kits',
    price: '$19',
    badge: 'New Release',
    description: 'High-converting Japanese restaurant UI template with glassmorphism design, smooth frame animations, and online menu ordering.',
    imageUrl: '/assets/shushiman.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://vanilla-food-website.vercel.app/',
    features: ['HTML5 Canvas Animations', 'Dark Mode Palette', 'Mobile First Layout', '6 Prebuilt Pages']
  },
  {
    id: 'prod-4',
    title: 'Venomous Dark Studio Theme',
    category: 'Templates',
    price: '$39',
    badge: 'Featured',
    description: 'Sleek portfolio & agency showcase template featuring 192-frame background animation canvas, reviews slider, and contact forms.',
    imageUrl: '/assets/Venomous Studio.png',
    buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
    demoUrl: 'https://venomous-studio.vercel.app/',
    features: ['Frame Animation Engine', 'Firebase & MongoDB Ready', 'SEO Optimized', 'Tailored CSS System']
  }
];

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    let loadedProducts = [];

    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        loadedProducts = data.data;
      }
    } catch (err) {
      console.warn('API fetch warning, loading local storage cache:', err);
    }

    // Fallback to localStorage or default seed list if API returns empty
    if (loadedProducts.length === 0) {
      const local = typeof window !== 'undefined' ? localStorage.getItem('app_products_cache') : null;
      if (local) {
        try {
          loadedProducts = JSON.parse(local);
        } catch (e) {}
      }
      if (!loadedProducts || loadedProducts.length === 0) {
        loadedProducts = seedProductsList;
        if (typeof window !== 'undefined') {
          localStorage.setItem('app_products_cache', JSON.stringify(seedProductsList));
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_products_cache', JSON.stringify(loadedProducts));
      }
    }

    setProducts(loadedProducts);
    setLoading(false);
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Digital Product')))];

  const filteredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div id="page-products" className="page-view active" style={{ paddingBottom: '80px' }}>
      <section className="projects-section">
        <div className="section-tag">
          <span className="orange-dot"></span>
          <span>STORE & DIGITAL PRODUCTS</span>
        </div>
        <h2 className="section-title">Premium Digital Products & Source Code</h2>

        {/* Category Filters */}
        <div className="projects-tabs-row" style={{ marginBottom: '40px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`project-tab-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#ff7700', fontSize: '18px', fontWeight: 'bold' }}>Loading Digital Products...</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProducts.map((prod) => (
              <div 
                key={prod._id || prod.id || prod.title} 
                className="project-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  backgroundColor: 'rgba(20, 18, 16, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 119, 0, 0.2)',
                  borderRadius: '20px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {/* Image & Price Badge */}
                <div className="project-card-image-wrap" style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
                  <img 
                    src={prod.imageUrl || '/assets/muhammad-hasil.png'} 
                    alt={prod.title} 
                    style={{ width: '100%', height: '210px', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#ff7700', color: '#000', fontWeight: '800', fontSize: '13px', padding: '4px 12px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(255,119,0,0.4)' }}>
                    {prod.price || 'Free'}
                  </div>
                  {prod.badge && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: '600', fontSize: '11px', padding: '4px 10px', borderRadius: '12px' }}>
                      {prod.badge}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="hero-tagline-badge" style={{ fontSize: '11px', margin: 0 }}>
                      <span className="orange-dot"></span> {prod.category || 'Digital Asset'}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', margin: '8px 0' }}>
                    {prod.title}
                  </h3>
                  
                  <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
                    {prod.description}
                  </p>

                  {/* Feature list tags */}
                  {prod.features && prod.features.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {prod.features.map((ft, idx) => (
                        <span key={idx} style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ddd', padding: '3px 8px', borderRadius: '6px' }}>
                          ✓ {ft}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a 
                    href={prod.buyUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary" 
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '12px', fontSize: '14px', borderRadius: '10px' }}
                  >
                    Get Product ↗
                  </a>
                  {prod.demoUrl && (
                    <a 
                      href={prod.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary" 
                      style={{ padding: '12px 16px', textDecoration: 'none', fontSize: '14px', borderRadius: '10px' }}
                    >
                      Demo ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

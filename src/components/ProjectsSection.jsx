import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getCombinedProjects, initialSeedProjects } from '../lib/storage';

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [apiProjects, setApiProjects] = useState(initialSeedProjects);
  const [firestoreProjects, setFirestoreProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // 0. Cache hydration
    try {
      const cached = localStorage.getItem('app_projects_cache_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) setApiProjects(parsed);
      }
    } catch (e) {}

    // 1. Fetch from MongoDB API
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setApiProjects(data.data);
          try {
            localStorage.setItem('app_projects_cache_v2', JSON.stringify(data.data));
          } catch (e) {}
        }
      })
      .catch(err => console.warn('Projects API note:', err));

    // 2. Optional Firestore sync
    let unsubProjects = () => { };
    try {
      if (db) {
        const refProjects = collection(db, 'projects');
        unsubProjects = onSnapshot(refProjects, (snapshot) => {
          const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFirestoreProjects(projs);
        }, (err) => {
          console.warn("Firestore projects snapshot notice:", err);
        });
      }
    } catch (e) {
      console.warn("Firestore connection notice:", e);
    }

    return () => {
      unsubProjects();
    };
  }, []);

  // Keyboard shortcut: close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Deduplicate strictly by title and unique id so each project is posted strictly once
  const rawList = apiProjects && apiProjects.length > 0 ? apiProjects : getCombinedProjects(firestoreProjects);
  const seenKeys = new Set();
  const mergedProjects = [];
  rawList.forEach(p => {
    const titleKey = (p.title || p.id || p._id || '').toString().toLowerCase().trim();
    if (titleKey && !seenKeys.has(titleKey)) {
      seenKeys.add(titleKey);
      mergedProjects.push(p);
    }
  });

  // Filter counts
  const countFullstack = mergedProjects.filter(p => (p.category || '').includes('fullstack')).length;
  const countReact = mergedProjects.filter(p => (p.category || '').includes('react')).length;
  const countDesign = mergedProjects.filter(p => (p.category || '').includes('design')).length;

  const filteredProjects = mergedProjects.filter(p => {
    const matchesFilter = filter === 'all' ? true : (p.category || '').includes(filter);
    const matchesSearch = searchQuery === '' ? true :
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(p.technologies) ? p.technologies.join(' ') : (p.technologies || '')).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Popular tags for quick filter chips
  const popularTags = ['All', 'React', 'Next.js', 'Full Stack', 'Node.js', 'MongoDB', 'PostgreSQL', 'Tailwind', 'API'];

  // Handle Tag Chip Click
  const handleTagClick = (tag) => {
    if (tag === 'All') {
      setSearchQuery('');
      setFilter('all');
    } else {
      setSearchQuery(tag);
    }
  };

  return (
    <div id="page-projects" className="page-view active">
      <section className="projects-section">
        {/* Top Summary Metrics Responsive Grid */}
        <div className="portfolio-summary-section" style={{ margin: '0 0 36px 0', padding: 0 }}>
          <div className="portfolio-metrics-grid">
            <div className="metric-card-pro">
              <div className="metric-card-corner"></div>
              <div className="metric-top-row">
                <div className="metric-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    <polyline points="9 13 12 16 22 6"></polyline>
                  </svg>
                </div>
                <span className="metric-trend-badge">
                  {mergedProjects.length} Active
                </span>
              </div>
              <div>
                <div className="metric-number-highlight">299+</div>
                <div className="metric-title-text">Projects Completed</div>
                <p className="metric-desc-text">Production web apps & full-stack platforms.</p>
              </div>
            </div>

            <div className="metric-card-pro">
              <div className="metric-card-corner"></div>
              <div className="metric-top-row">
                <div className="metric-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <span className="metric-trend-badge">
                  Worldwide
                </span>
              </div>
              <div>
                <div className="metric-number-highlight">200+</div>
                <div className="metric-title-text">Happy Clients</div>
                <p className="metric-desc-text">Global founders & creative digital agencies.</p>
              </div>
            </div>

            <div className="metric-card-pro">
              <div className="metric-card-corner"></div>
              <div className="metric-top-row">
                <div className="metric-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span className="metric-trend-badge" style={{ color: '#ff7700', backgroundColor: 'rgba(255, 119, 0, 0.15)', borderColor: 'rgba(255, 119, 0, 0.35)' }}>
                  Full-Stack
                </span>
              </div>
              <div>
                <div className="metric-number-highlight">6+ Years</div>
                <div className="metric-title-text">Years Experience</div>
                <p className="metric-desc-text">React, Next.js, Node.js & modern DBs.</p>
              </div>
            </div>

            <div className="metric-card-pro">
              <div className="metric-card-corner"></div>
              <div className="metric-top-row">
                <div className="metric-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <span className="metric-trend-badge">
                  5.0 ★ Rating
                </span>
              </div>
              <div>
                <div className="metric-number-highlight">99.8%</div>
                <div className="metric-title-text">Satisfaction Rate</div>
                <p className="metric-desc-text">Clean architecture, fast turnarounds & support.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="projects-header">
          <div className="section-tag">
            <span className="orange-dot"></span>
            <span>Featured Engineering Work</span>
          </div>
          <h2 className="section-title">Production Web Applications & UI Systems</h2>
          <p style={{ color: '#ffffff', opacity: 0.95, maxWidth: '680px', margin: '0 0 24px 0', fontSize: '15px', lineHeight: 1.6 }}>
            Explore custom full-stack solutions built with React, Next.js, Node.js, MongoDB & PostgreSQL database architecture.
          </p>

          {/* Real-Time Search & Interactive Filter Wrapper */}
          <div className="search-filter-wrapper">
            {/* Input Row */}
            <div className="search-input-box">
              <div className="search-icon-left">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects by title, tech stack (React, Next.js, MongoDB), or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Clear search (Esc)"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Tag Chips */}
            <div className="search-tags-row">
              <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600, marginRight: '6px' }}>
                Filter by Tags:
              </span>
              {popularTags.map((tag, idx) => {
                const isSelected = (tag === 'All' && !searchQuery && filter === 'all') ||
                  (searchQuery.toLowerCase() === tag.toLowerCase());
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`search-tag-chip ${isSelected ? 'active' : ''}`}
                  >
                    {tag === 'All' ? '✦ All Tech' : `#${tag}`}
                  </button>
                );
              })}
            </div>

            {/* Category Tabs & Dynamic Counter Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="projects-tabs-row" id="projects-tabs" style={{ margin: 0 }}>
                <button
                  className={`project-tab-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Projects ({mergedProjects.length})
                </button>
                <button
                  className={`project-tab-btn ${filter === 'fullstack' ? 'active' : ''}`}
                  onClick={() => setFilter('fullstack')}
                >
                  Full Stack ({countFullstack})
                </button>
                <button
                  className={`project-tab-btn ${filter === 'react' ? 'active' : ''}`}
                  onClick={() => setFilter('react')}
                >
                  React & Next.js ({countReact})
                </button>
                <button
                  className={`project-tab-btn ${filter === 'design' ? 'active' : ''}`}
                  onClick={() => setFilter('design')}
                >
                  UI/UX & Design ({countDesign})
                </button>
              </div>

              <div className="search-feedback-bar">
                <span>
                  Showing <strong className="search-count-badge">{filteredProjects.length}</strong> of {mergedProjects.length} projects
                  {searchQuery && (
                    <span> matching &ldquo;<span style={{ color: '#fff' }}>{searchQuery}</span>&rdquo;</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Optimized Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'rgba(16, 16, 22, 0.8)',
            borderRadius: '20px',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            margin: '20px 0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              No projects found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p style={{ color: '#ffffff', opacity: 0.9, fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              Try searching with a different technology keyword like React, Next.js, Node.js, or fullstack.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              style={{
                backgroundColor: '#ff7700',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 119, 0, 0.35)'
              }}
            >
              Reset Search & Show All Projects
            </button>
          </div>
        ) : (
          <div className="projects-grid" id="projects-grid">
          {filteredProjects.map((proj) => {
            const techList = Array.isArray(proj.technologies)
              ? proj.technologies
              : (proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : ['React', 'Next.js']);

            return (
              <article key={proj.id || proj._id} className="project-card" data-category={proj.category}>
                <div>
                  <div className="project-image-box">
                    <img
                      src={formatImageUrl(proj.imageUrl)}
                      alt={proj.title}
                      className="project-img"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/muhammad-hasil.png';
                      }}
                    />
                    <div 
                      className="project-overlay-link" 
                      onClick={() => setSelectedProject(proj)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span
                        style={{
                          backgroundColor: 'rgba(16, 14, 12, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12px',
                          padding: '6px 14px',
                          borderRadius: '999px',
                          backdropFilter: 'blur(8px)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>Click to View</span>
                      </span>
                    </div>
                  </div>

                  <div className="project-info">
                    <div className="project-info-header">
                      <h3 
                        className="project-title"
                        onClick={() => setSelectedProject(proj)}
                        style={{ cursor: 'pointer' }}
                      >
                        {proj.title}
                      </h3>
                      <span className="project-pill">{proj.pill || 'Full Stack'}</span>
                    </div>
                    <p className="project-desc">{proj.description}</p>
                  </div>
                </div>

                <div>
                  {/* Tech stack badges */}
                  <div className="project-tech-tags">
                    {techList.slice(0, 4).map((tech, idx) => (
                      <span key={idx} className="project-tech-tag">
                        {tech}
                      </span>
                    ))}
                    {techList.length > 4 && (
                      <span className="project-tech-tag" style={{ color: '#ff7700' }}>
                        +{techList.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="project-card-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '16px' }}>
                    {proj.liveDemoUrl && proj.liveDemoUrl !== '#' ? (
                      <a 
                        href={proj.liveDemoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-live-demo-text"
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#ff7700',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(255, 119, 0, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>Live Demo</span> <span className="arrow">↗</span>
                      </a>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setSelectedProject(proj)}
                      className="btn-details-text"
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        color: '#f3f4f6',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </section>

      {/* Tech Stack Marquee Banner */}
      <section className="tech-marquee-section">
        <div className="tech-marquee-track">
          <div className="tech-marquee-content">
            <span className="tech-brand-item"><span className="tech-star">✦</span> REACT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NEXT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> MONGODB ATLAS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NODE.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIREBASE AUTH</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> TAILWIND CSS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> RESTFUL APIS</span>
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            <span className="tech-brand-item"><span className="tech-star">✦</span> REACT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NEXT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> MONGODB ATLAS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NODE.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIREBASE AUTH</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> TAILWIND CSS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> RESTFUL APIS</span>
          </div>
        </div>
      </section>

      {/* Quick View Modal Lightbox */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(16, 14, 12, 0.94)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 119, 0, 0.35)',
              borderRadius: '24px',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 28px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(255, 119, 0, 0.18)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#fff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 119, 0, 0.3)'; e.currentTarget.style.borderColor = '#ff7700'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'; }}
            >
              ✕
            </button>

            <div style={{ borderRadius: '18px', overflow: 'hidden', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 12px 30px rgba(0,0,0,0.6)', maxHeight: '340px' }}>
              <img
                src={formatImageUrl(selectedProject.imageUrl)}
                alt={selectedProject.title}
                style={{ width: '100%', height: '320px', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#ff7700', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(255, 119, 0, 0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255, 119, 0, 0.3)' }}>
                {selectedProject.category}
              </span>
              <span style={{ color: '#64748b' }}>·</span>
              <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600 }}>
                {selectedProject.pill || 'Full-Stack Web App'}
              </span>
              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700, marginLeft: 'auto' }}>
                ● Live Production Architecture
              </span>
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: '0 0 14px 0', letterSpacing: '-0.5px' }}>
              {selectedProject.title}
            </h2>

            <p style={{ color: '#d1d5db', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px 0' }}>
              {selectedProject.description}
            </p>

            {/* Technologies */}
            <div style={{ marginBottom: '28px' }}>
              <strong style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Architecture & Core Tech Stack
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(Array.isArray(selectedProject.technologies)
                  ? selectedProject.technologies
                  : (selectedProject.technologies ? selectedProject.technologies.split(',').map(t => t.trim()) : ['React', 'Next.js', 'Node.js', 'MongoDB'])
                ).map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '12px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#f3f4f6',
                      fontWeight: 600
                    }}
                  >
                    ✦ {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '22px' }}>
              {selectedProject.liveDemoUrl && selectedProject.liveDemoUrl !== '#' && (
                <a
                  href={selectedProject.liveDemoUrl}
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
                    boxShadow: '0 4px 20px rgba(255, 119, 0, 0.45)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Open Live Application</span> <span className="arrow">↗</span>
                </a>
              )}
              {selectedProject.githubUrl ? (
                <a
                  href={selectedProject.githubUrl}
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
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>GitHub Repository</span> <span className="arrow">↗</span>
                </a>
              ) : null}
              <Link
                href="/contact"
                onClick={() => setSelectedProject(null)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#ff7700',
                  padding: '12px 20px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 119, 0, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: 'auto'
                }}
              >
                <span>Inquire About Similar Project</span> <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

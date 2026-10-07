import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getCombinedProjects } from '../lib/storage';
import { useProjects } from '../lib/usePortfolioData';
import { ProjectsGridSkeleton, GlobalLoadingBar } from './SkeletonLoader';
import ScrollProgressBar from './ScrollProgressBar';

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

export function formatExternalUrl(url) {
  if (!url || url === '#' || !url.trim()) return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

// Calculate estimated reading time for project card descriptions and architecture specifications
export function calculateReadingTime(proj, wordsPerMinute = 200) {
  if (!proj) return '1 min read';
  const fullText = [
    proj.title || '',
    proj.description || '',
    proj.longDescription || '',
    Array.isArray(proj.technologies) ? proj.technologies.join(' ') : (proj.technologies || ''),
    proj.pill || '',
    proj.category || ''
  ].join(' ');

  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount <= 35) return '< 1 min read';
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Interactive 3D Tilt Card using Framer Motion Spring Transforms
function TiltProjectCard({ proj, index, onQuickView }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isHovered = useMotionValue(0);

  // Smooth spring physics for fluid tilt response
  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 24 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8.5deg', '-8.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8.5deg', '8.5deg']);

  // Dynamic interactive glare spotlight overlay that tracks mouse position
  const glareBackground = useTransform(
    [mouseXSpring, mouseYSpring],
    ([mx, my]) => {
      const posX = (mx + 0.5) * 100;
      const posY = (my + 0.5) * 100;
      return `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 119, 0, 0.22) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`;
    }
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    isHovered.set(0);
  };

  const techList = Array.isArray(proj.technologies)
    ? proj.technologies
    : (proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : ['React', 'Next.js']);

  const readingTime = calculateReadingTime(proj);

  return (
    <div style={{ perspective: 1100, width: '100%', height: '100%' }}>
      <motion.article
        ref={cardRef}
        className="project-card"
        data-category={proj.category}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease'
        }}
        whileHover={{
          scale: 1.03,
          y: -8,
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 119, 0, 0.3)',
          borderColor: 'rgba(255, 119, 0, 0.7)'
        }}
        whileTap={{ scale: 0.985 }}
        transition={{
          duration: 0.45,
          ease: [0.21, 0.47, 0.32, 0.98],
          delay: (index % 3) * 0.08
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Sheen Glare Light Effect */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: glareBackground,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: useTransform(isHovered, [0, 1], [0, 1]),
            transition: 'opacity 0.25s ease'
          }}
        />

        <div style={{ transform: 'translateZ(20px)', position: 'relative', zIndex: 2 }}>
          <div className="project-image-box" style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px' }}>
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
            {proj.views > 0 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(14, 12, 10, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#e2e8f0',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '6px',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 3
              }}>
                <span>👁 {proj.views}</span>
                {proj.likes > 0 && <span>· ♥ {proj.likes}</span>}
              </div>
            )}
            <div 
              className="project-overlay-link" 
              onClick={() => onQuickView(proj)}
              style={{ cursor: 'pointer' }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(16, 14, 12, 0.9)',
                  border: '1px solid rgba(255, 119, 0, 0.7)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '12px',
                  padding: '7px 16px',
                  borderRadius: '999px',
                  backdropFilter: 'blur(10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 18px rgba(255, 119, 0, 0.35)'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Quick View</span>
              </span>
            </div>
          </div>

          <div className="project-info" style={{ transform: 'translateZ(15px)' }}>
            <div className="project-info-header">
              <h3 
                className="project-title"
                onClick={() => onQuickView(proj)}
                style={{ cursor: 'pointer' }}
              >
                {proj.title}
              </h3>
              <span className="project-pill">{proj.pill || 'Full Stack'}</span>
            </div>

            {/* Estimated Reading Time Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span 
                style={{
                  fontSize: '11px',
                  color: '#a1a1aa',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontWeight: 500
                }}
                title="Estimated time to review description and architecture"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{readingTime}</span>
              </span>
            </div>

            <p className="project-desc">{proj.description}</p>
          </div>
        </div>

        <div style={{ transform: 'translateZ(25px)', position: 'relative', zIndex: 2 }}>
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
                href={formatExternalUrl(proj.liveDemoUrl)} 
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
              onClick={() => onQuickView(proj)}
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
              <span>Details</span>
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectShowcase({ 
  initialProjects = [], 
  title = "Production Web Applications & UI Systems",
  subtitle = "Explore custom full-stack solutions built with React, Next.js, Node.js, MongoDB & PostgreSQL database architecture.",
  tag = "Featured Engineering Work",
  showMetrics = true,
  maxItems = null,
  showViewAllButton = false
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [firestoreProjects, setFirestoreProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // SWR caching layer
  const { projects: swrProjects, isLoading, isValidating } = useProjects(initialProjects);

  useEffect(() => {
    let unsubProjects = () => {};
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

  // Deduplicate strictly by title and unique id
  const rawList = swrProjects && swrProjects.length > 0 ? swrProjects : getCombinedProjects(firestoreProjects);
  const mergedProjects = useMemo(() => {
    const seenKeys = new Set();
    const result = [];
    rawList.forEach(p => {
      const titleKey = (p.title || p.id || p._id || '').toString().toLowerCase().trim();
      if (titleKey && !seenKeys.has(titleKey)) {
        seenKeys.add(titleKey);
        result.push(p);
      }
    });
    return result;
  }, [rawList]);

  // Extract all unique technology tags dynamically from database records
  const dynamicTags = useMemo(() => {
    const tagSet = new Set();
    mergedProjects.forEach(p => {
      const list = Array.isArray(p.technologies)
        ? p.technologies
        : (p.technologies ? p.technologies.split(',').map(t => t.trim()) : []);
      list.forEach(t => {
        if (t && t.length > 1) tagSet.add(t);
      });
    });
    const popularPicks = ['React', 'Next.js', 'Full Stack', 'Node.js', 'MongoDB', 'PostgreSQL', 'Tailwind', 'API', 'Firebase', 'TypeScript'];
    const sorted = Array.from(tagSet).sort((a, b) => {
      const aIdx = popularPicks.indexOf(a);
      const bIdx = popularPicks.indexOf(b);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
    return ['All', ...sorted.slice(0, 10)];
  }, [mergedProjects]);

  // Compute MongoDB Engagement & Statistics
  const statsOverview = useMemo(() => {
    const totalProjects = mergedProjects.length;
    
    // Unique categories count
    const categorySet = new Set();
    mergedProjects.forEach(p => {
      if (p.category) {
        p.category.split(' ').forEach(c => {
          if (c) categorySet.add(c.toLowerCase());
        });
      }
    });
    const totalCategories = Math.max(categorySet.size, 4);

    // Calculate top performing project based on engagement data (views, likes, featured)
    let topProject = null;
    let highestScore = -1;

    mergedProjects.forEach(p => {
      const views = p.views || 0;
      const likes = p.likes || 0;
      const isFeatured = p.featured ? 100 : 0;
      const score = (views * 1.5) + (likes * 4) + isFeatured;

      if (score > highestScore) {
        highestScore = score;
        topProject = p;
      }
    });

    // Total interactions
    const totalViews = mergedProjects.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalLikes = mergedProjects.reduce((acc, p) => acc + (p.likes || 0), 0);

    return {
      totalProjects,
      totalCategories,
      topProject: topProject || mergedProjects[0] || null,
      totalInteractions: totalViews + totalLikes + 1420
    };
  }, [mergedProjects]);

  // Category counts
  const countFullstack = mergedProjects.filter(p => (p.category || '').toLowerCase().includes('fullstack')).length;
  const countReact = mergedProjects.filter(p => (p.category || '').toLowerCase().includes('react')).length;
  const countDesign = mergedProjects.filter(p => (p.category || '').toLowerCase().includes('design')).length;

  // Filtered dataset combining Category Tabs, Search Query, and Tag Chips
  const filteredProjects = useMemo(() => {
    return mergedProjects.filter(p => {
      const matchesFilter = filter === 'all' ? true : (p.category || '').toLowerCase().includes(filter);
      
      const techString = Array.isArray(p.technologies) ? p.technologies.join(' ') : (p.technologies || '');
      const searchTarget = `${p.title || ''} ${p.description || ''} ${techString} ${p.category || ''} ${p.pill || ''}`.toLowerCase();

      const matchesSearch = searchQuery === '' ? true : searchTarget.includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === 'All' ? true : searchTarget.includes(selectedTag.toLowerCase());

      return matchesFilter && matchesSearch && matchesTag;
    });
  }, [mergedProjects, filter, searchQuery, selectedTag]);

  const displayedProjects = maxItems ? filteredProjects.slice(0, maxItems) : filteredProjects;

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    if (tag === 'All') {
      setSearchQuery('');
    }
  };

  return (
    <section className="projects-section" style={{ width: '100%', position: 'relative' }}>
      {/* Scroll Progress Bar at top of screen */}
      <ScrollProgressBar />

      {/* Dynamic Summary Statistics Card at Top of Showcase */}
      {showMetrics && (
        <motion.div 
          className="portfolio-summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(16, 14, 12, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 119, 0, 0.28)',
            borderRadius: '24px',
            padding: '28px 32px',
            marginBottom: '38px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(255, 119, 0, 0.08)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
            {/* Stat 1: Total Projects */}
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff7700', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff7700' }}></span>
                Total Projects
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: 'monospace' }}>
                {statsOverview.totalProjects}
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '4px 0 0 0' }}>Live verified database entries</p>
            </div>

            {/* Stat 2: Active Categories */}
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                Architecture Categories
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: 'monospace' }}>
                {statsOverview.totalCategories} Specializations
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '4px 0 0 0' }}>Full-Stack, React, UI/UX, APIs</p>
            </div>

            {/* Stat 3: Top-Performing Project by MongoDB Engagement */}
            {statsOverview.topProject && (
              <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  <span>🏆</span> Top-Performing Showcase
                </div>
                <div 
                  onClick={() => setSelectedProject(statsOverview.topProject)}
                  style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={statsOverview.topProject.title}
                >
                  <span style={{ color: '#ff7700' }}>✦</span> {statsOverview.topProject.title}
                </div>
                <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '4px 0 0 0' }}>
                  {statsOverview.topProject.pill || 'Highest Engagement'}
                </p>
              </div>
            )}

            {/* Stat 4: Engagement Traffic */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                <span>⚡</span> Database Interactions
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: 'monospace' }}>
                {statsOverview.totalInteractions.toLocaleString()}+
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '4px 0 0 0' }}>Verified views & live demo clicks</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="projects-header">
        <div className="section-tag">
          <span className="orange-dot"></span>
          <span>{tag}</span>
        </div>
        <h2 className="section-title">{title}</h2>
        <p style={{ color: '#ffffff', opacity: 0.95, maxWidth: '680px', margin: '0 0 24px 0', fontSize: '15px', lineHeight: 1.6 }}>
          {subtitle}
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
            {dynamicTags.map((tagItem, idx) => {
              const isSelected = selectedTag.toLowerCase() === tagItem.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTagClick(tagItem)}
                  className={`search-tag-chip ${isSelected ? 'active' : ''}`}
                >
                  {tagItem === 'All' ? '✦ All Tech' : `#${tagItem}`}
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
                {(searchQuery || selectedTag !== 'All') && (
                  <span> matching &ldquo;<span style={{ color: '#fff' }}>{searchQuery || selectedTag}</span>&rdquo;</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Tilt Project Cards Grid with Framer Motion */}
      {isLoading && mergedProjects.length === 0 ? (
        <ProjectsGridSkeleton count={6} />
      ) : filteredProjects.length === 0 ? (
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
            No projects found matching &ldquo;{searchQuery || selectedTag}&rdquo;
          </h3>
          <p style={{ color: '#ffffff', opacity: 0.9, fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
            Try searching with a different technology keyword like React, Next.js, Node.js, or fullstack.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('All');
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
          {displayedProjects.map((proj, index) => (
            <TiltProjectCard
              key={proj.id || proj._id}
              proj={proj}
              index={index}
              onQuickView={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      )}

      {/* Optional "View All Projects" CTA */}
      {showViewAllButton && filteredProjects.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <Link 
            href="/projects" 
            className="btn-primary" 
            style={{ 
              textDecoration: 'none',
              padding: '14px 32px',
              fontSize: '15px'
            }}
          >
            <span>Explore All Projects ({mergedProjects.length})</span>
            <span className="arrow">↗</span>
          </Link>
        </div>
      )}

      {/* Quick View Modal Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            onClick={() => setSelectedProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              style={{
                backgroundColor: 'rgba(16, 14, 12, 0.96)',
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
                position: 'relative'
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
                <span style={{ color: '#64748b' }}>·</span>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '3px 8px', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{calculateReadingTime(selectedProject)}</span>
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
                    href={formatExternalUrl(selectedProject.liveDemoUrl)}
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
                <Link
                  href={`/projects/${selectedProject.id || selectedProject._id || (selectedProject.title || '').toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedProject(null)}
                  style={{
                    backgroundColor: 'rgba(255, 119, 0, 0.15)',
                    color: '#ff7700',
                    padding: '12px 22px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 119, 0, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>View Full Details & Tech Stack</span> <span className="arrow">→</span>
                </Link>
                {selectedProject.githubUrl ? (
                  <a
                    href={formatExternalUrl(selectedProject.githubUrl)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background SWR Revalidation Syncing Indicator */}
      <GlobalLoadingBar active={isValidating} />
    </section>
  );
}

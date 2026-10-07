import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProjects } from '../lib/usePortfolioData';
import { initialSeedProjects } from '../lib/storage';
import GlobalSearchBar from './GlobalSearchBar';

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

export default function ProjectGrid({ initialProjects = [], limit, showFilters = true, title = "Featured Portfolio Projects", subtitle = "Handcrafted full-stack platforms and web systems fetched directly from the database." }) {
  const { projects: swrProjects, isLoading } = useProjects(initialProjects);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const projectsList = Array.isArray(swrProjects) && swrProjects.length > 0 
    ? swrProjects 
    : (Array.isArray(initialProjects) && initialProjects.length > 0 ? initialProjects : initialSeedProjects);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProjectClick = (proj, type = 'click') => {
    const id = proj.id || proj._id;
    if (id) {
      fetch('/api/projects/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type })
      }).catch(() => {});
    }
  };

  const filteredProjects = projectsList.filter(p => {
    const pType = (p.projectType || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pPill = (p.pill || '').toLowerCase();
    const pTags = Array.isArray(p.tags) 
      ? p.tags.map(t => t.toLowerCase()) 
      : (p.tags ? p.tags.toLowerCase().split(',').map(t => t.trim()) : []);

    const matchesCategory = filter === 'all' 
      ? true 
      : (
          pType.includes(filter.toLowerCase()) || 
          pCat.includes(filter.toLowerCase()) || 
          pPill.includes(filter.toLowerCase()) ||
          pTags.some(t => t.includes(filter.toLowerCase()))
        );

    if (!searchQuery.trim()) return matchesCategory;

    const q = searchQuery.toLowerCase().trim();
    const titleMatch = (p.title || '').toLowerCase().includes(q);
    const techArray = Array.isArray(p.technologies) 
      ? p.technologies 
      : (p.technologies ? p.technologies.split(',') : []);
    const techMatch = techArray.some(t => t.toLowerCase().includes(q));
    const descMatch = (p.description || '').toLowerCase().includes(q);
    const pillMatch = (p.pill || '').toLowerCase().includes(q);
    const typeMatch = pType.includes(q);
    const tagsMatch = pTags.some(t => t.includes(q));

    return matchesCategory && (titleMatch || techMatch || descMatch || pillMatch || typeMatch || tagsMatch);
  });

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  return (
    <div className="project-grid-component" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Header & Category Filters */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-orange)' }}></span>
            MongoDB Data Store
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.6vw, 2.5rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'saas', label: 'SaaS' },
              { id: 'mobile', label: 'Mobile' },
              { id: 'web', label: 'Web Apps' },
              { id: 'fullstack', label: 'Full Stack' },
              { id: 'design', label: 'UI/UX' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: filter === tab.id ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: filter === tab.id ? 'var(--accent-orange)' : '#18110c',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Global Search & Tech Stack Filtering Bar */}
      <GlobalSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        projects={projectsList}
        resultCount={displayedProjects.length}
        placeholder="Filter portfolio by title or technology stack (React, Next.js, Node.js, MongoDB)..."
      />

      {/* Grid Container */}
      {displayedProjects.length === 0 ? (
        <div 
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: '#18110c',
            border: '1px dashed var(--border-card)',
            borderRadius: '20px',
            color: 'var(--text-secondary)'
          }}
        >
          {searchQuery ? (
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                No projects found matching &quot;{searchQuery}&quot;
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                Try searching for technologies like React, Next.js, Node.js, or MongoDB.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  backgroundColor: 'var(--accent-orange)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            'No portfolio projects found for this category.'
          )}
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {displayedProjects.map((proj) => {
            const techList = Array.isArray(proj.technologies)
              ? proj.technologies
              : (proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : ['React', 'Next.js']);

            return (
              <div 
                key={proj.id || proj._id}
                style={{
                  backgroundColor: '#18110c',
                  border: '1px solid var(--border-card)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: 'translateZ(0)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(223, 99, 38, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-card)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Image Thumbnail */}
                  <div 
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '210px',
                      backgroundColor: '#120a06',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedProject(proj);
                      handleProjectClick(proj, 'view');
                    }}
                  >
                    <img 
                      src={formatImageUrl(proj.imageUrl)} 
                      alt={proj.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.35s ease'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/muhammad-hasil.png';
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(18, 12, 8, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--accent-orange)'
                      }}
                    >
                      {proj.pill || 'Featured'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {proj.category || 'Full Stack'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Live System
                      </span>
                    </div>

                    <h3 
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginBottom: '10px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedProject(proj)}
                    >
                      {proj.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
                      {proj.description}
                    </p>

                    {/* Tech stack badges */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {techList.slice(0, 4).map((tech, i) => (
                        <span 
                          key={i} 
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#ffffff',
                            backgroundColor: '#241913',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ padding: '0 24px 24px', display: 'flex', gap: '10px' }}>
                  {proj.liveDemoUrl && proj.liveDemoUrl !== '#' && (
                    <a 
                      href={proj.liveDemoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => handleProjectClick(proj, 'click')}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        backgroundColor: 'var(--accent-orange)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '10px 14px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      Live Demo <span>↗</span>
                    </a>
                  )}
                  <button 
                    type="button"
                    onClick={() => setSelectedProject(proj)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      backgroundColor: '#241913',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Details Modal Dialog */}
      {selectedProject && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div 
            style={{
              backgroundColor: '#18110c',
              border: '1px solid rgba(223, 99, 38, 0.3)',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxSizing: 'border-box',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              type="button"
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: '#241913',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              ✕
            </button>

            {/* Modal Image */}
            <div style={{ width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#120a06', marginBottom: '20px' }}>
              <img 
                src={formatImageUrl(selectedProject.imageUrl)} 
                alt={selectedProject.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {selectedProject.pill || 'Full Stack Application'}
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              {selectedProject.title}
            </h3>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedProject.description}
            </p>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Technologies Used:
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(Array.isArray(selectedProject.technologies) ? selectedProject.technologies : (selectedProject.technologies ? selectedProject.technologies.split(',') : ['React', 'Next.js'])).map((t, idx) => (
                  <span 
                    key={idx}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: '#241913',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href={`/projects/${selectedProject.id || selectedProject._id || (selectedProject.title || '').toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  backgroundColor: 'rgba(255, 119, 0, 0.15)',
                  color: '#ff7700',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 119, 0, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Full Case Study & Tech Stack <span>→</span>
              </Link>
              {selectedProject.liveDemoUrl && selectedProject.liveDemoUrl !== '#' && (
                <a 
                  href={selectedProject.liveDemoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{
                    backgroundColor: 'var(--accent-orange)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Visit Live Demo <span>↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

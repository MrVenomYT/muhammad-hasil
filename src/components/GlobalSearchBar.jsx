import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, X, ExternalLink, Layers, Globe, Sparkles, BookOpen } from 'lucide-react';
import { formatImageUrl } from './ProjectGrid';

const POPULAR_TECH_STACKS = [
  'All',
  'React',
  'Next.js',
  'Node.js',
  'MongoDB',
  'Tailwind CSS',
  'PostgreSQL',
  'Canvas 192-Frame Engine'
];

/**
 * GlobalSearchBar Component with Real-Time Search Filtering & Google Search Grounding
 * Filters portfolio projects by title or technology stack, with live web-grounded technical context.
 */
export default function GlobalSearchBar({
  searchQuery = '',
  setSearchQuery = () => {},
  projects = [],
  placeholder = 'Filter projects by title or technology stack (React, Next.js, Node.js, MongoDB)...',
  showTags = true,
  resultCount = null,
  className = '',
  isModal = false,
  isOpen = false,
  onClose = () => {}
}) {
  const router = useRouter();
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [groundingData, setGroundingData] = useState(null);
  const [groundingLoading, setGroundingLoading] = useState(false);
  const [groundingActive, setGroundingActive] = useState(true);

  // Sync internal query when controlled prop changes
  useEffect(() => {
    setInternalQuery(searchQuery);
  }, [searchQuery]);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isModal && isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isModal, isOpen]);

  // Handle keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModal && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModal, isOpen, onClose]);

  // Fetch Google Search Grounded Context via server-side API
  const fetchSearchGrounding = useCallback(async (q) => {
    const trimmed = (q || '').trim();
    if (!trimmed || trimmed.length < 2) {
      setGroundingData(null);
      setGroundingLoading(false);
      return;
    }

    setGroundingLoading(true);
    try {
      const res = await fetch('/api/projects/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, projects })
      });

      const json = await res.json();
      if (json.success) {
        setGroundingData(json);
      }
    } catch (err) {
      console.warn('Grounding fetch notice:', err.message);
    } finally {
      setGroundingLoading(false);
    }
  }, [projects]);

  // Debounce search grounding on query change
  useEffect(() => {
    if (!groundingActive) {
      setGroundingData(null);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!internalQuery.trim()) {
      setGroundingData(null);
      setGroundingLoading(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      fetchSearchGrounding(internalQuery);
    }, 700);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [internalQuery, groundingActive, fetchSearchGrounding]);

  const handleQueryChange = (val) => {
    setInternalQuery(val);
    setSearchQuery(val);
  };

  const handleClear = () => {
    setInternalQuery('');
    setSearchQuery('');
    setGroundingData(null);
    inputRef.current?.focus();
  };

  const handleTagClick = (tag) => {
    if (tag === 'All') {
      handleQueryChange('');
    } else {
      handleQueryChange(tag);
    }
  };

  // Filter projects for modal preview and real-time filtering
  const matchingProjects = (projects || []).filter((p) => {
    if (!internalQuery.trim()) return true;
    const q = internalQuery.toLowerCase().trim();
    const titleMatch = (p.title || '').toLowerCase().includes(q);
    const techArray = Array.isArray(p.technologies) 
      ? p.technologies 
      : (p.technologies ? p.technologies.split(',') : []);
    const techMatch = techArray.some(t => t.toLowerCase().includes(q));
    const catMatch = (p.category || '').toLowerCase().includes(q);
    const pillMatch = (p.pill || '').toLowerCase().includes(q);
    return titleMatch || techMatch || catMatch || pillMatch;
  });

  // Grounded Context Box Render
  const renderGroundedContext = () => {
    if (!groundingActive || (!groundingData && !groundingLoading)) return null;

    if (groundingLoading) {
      return (
        <div 
          style={{
            marginTop: '14px',
            backgroundColor: '#120c08',
            border: '1px solid rgba(223, 99, 38, 0.25)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#94a3b8'
          }}
        >
          <div style={{ width: '14px', height: '14px', border: '2px solid rgba(223, 99, 38, 0.2)', borderTopColor: '#df6326', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <span>Retrieving Google Search grounding context for &quot;{internalQuery}&quot;...</span>
        </div>
      );
    }

    if (groundingData && groundingData.summary) {
      return (
        <div 
          style={{
            marginTop: '14px',
            backgroundColor: '#18110c',
            border: '1px solid rgba(223, 99, 38, 0.35)',
            borderRadius: '14px',
            padding: '16px 20px',
            boxSizing: 'border-box',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'rgba(223, 99, 38, 0.15)',
                  border: '1px solid rgba(223, 99, 38, 0.35)',
                  color: 'var(--accent-orange, #df6326)',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                <Globe size={12} />
                Google Search Grounded Context
              </span>

              {groundingData.queries && groundingData.queries.length > 0 && (
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Query: {groundingData.queries[0]}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setGroundingData(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Dismiss grounded insight"
            >
              <X size={13} />
              <span>Dismiss</span>
            </button>
          </div>

          {/* Grounded Summary Text */}
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1', margin: '0 0 12px 0' }}>
            {groundingData.summary}
          </p>

          {/* Grounded Sources & Queries */}
          {groundingData.sources && groundingData.sources.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={11} />
                Web Sources:
              </span>
              {groundingData.sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '11px',
                    color: '#df6326',
                    textDecoration: 'none',
                    backgroundColor: '#120c08',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{src.title}</span>
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Inline Search Bar
  const searchInputContent = (
    <div style={{ width: '100%' }}>
      {/* Search Input Box */}
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#130c08',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          padding: '4px 16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'border-color 0.2s ease'
        }}
      >
        <Search 
          size={18} 
          style={{ color: 'var(--accent-orange, #df6326)', marginRight: '12px', flexShrink: 0 }} 
        />
        
        <input 
          ref={inputRef}
          type="text"
          value={internalQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '14px',
            padding: '12px 0',
            fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)'
          }}
        />

        {/* Google Grounding Status Badge */}
        <button
          type="button"
          onClick={() => setGroundingActive(prev => !prev)}
          title={groundingActive ? 'Google Search Grounding: Active' : 'Enable Google Search Grounding'}
          style={{
            backgroundColor: groundingActive ? 'rgba(223, 99, 38, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${groundingActive ? 'rgba(223, 99, 38, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '6px',
            color: groundingActive ? '#df6326' : '#64748b',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginRight: '8px'
          }}
        >
          <Globe size={12} />
          <span>Google Grounded</span>
        </button>

        {internalQuery && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'color 0.15s ease'
            }}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Technology Stack Tags */}
      {showTags && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={13} style={{ color: 'var(--accent-orange, #df6326)' }} />
            Tech Stack:
          </span>

          {POPULAR_TECH_STACKS.map((tag) => {
            const isSelected = (tag === 'All' && !internalQuery.trim()) ||
              (internalQuery.toLowerCase().trim() === tag.toLowerCase());

            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-orange, #df6326)' : 'rgba(255, 255, 255, 0.08)',
                  backgroundColor: isSelected ? 'var(--accent-orange, #df6326)' : '#18110c',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease'
                }}
              >
                {tag}
              </button>
            );
          })}

          {resultCount !== null && (
            <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
              Found {resultCount} {resultCount === 1 ? 'project' : 'projects'}
            </span>
          )}
        </div>
      )}

      {/* Render Grounded Context */}
      {renderGroundedContext()}
    </div>
  );

  // If used as modal
  if (isModal) {
    if (!isOpen) return null;

    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 20px 20px',
          boxSizing: 'border-box'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: '#18110c',
            border: '1px solid rgba(223, 99, 38, 0.35)',
            borderRadius: '20px',
            maxWidth: '720px',
            width: '100%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header with search input */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: 'var(--accent-orange, #df6326)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Globe size={15} />
                Global Project Search &amp; Google Grounding
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ESC to close
              </button>
            </div>

            {searchInputContent}
          </div>

          {/* Modal Results Body */}
          <div style={{ overflowY: 'auto', padding: '16px 24px', flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
              {matchingProjects.length} Portfolio {matchingProjects.length === 1 ? 'Result' : 'Results'}
            </div>

            {matchingProjects.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                No projects found matching &quot;{internalQuery}&quot;. Try searching for &quot;React&quot;, &quot;Next.js&quot;, or &quot;Node.js&quot;.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchingProjects.map((p) => {
                  const techList = Array.isArray(p.technologies) 
                    ? p.technologies 
                    : (p.technologies ? p.technologies.split(',') : ['React', 'Next.js']);

                  return (
                    <div
                      key={p.id || p._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#130c08',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        gap: '14px',
                        transition: 'border-color 0.2s ease, transform 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#241913', flexShrink: 0 }}>
                          <img 
                            src={formatImageUrl(p.imageUrl)} 
                            alt={p.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/muhammad-hasil.png';
                            }}
                          />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.title}
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-orange, #df6326)', backgroundColor: '#241913', padding: '2px 6px', borderRadius: '4px' }}>
                              {p.pill || 'Full Stack'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {techList.slice(0, 3).map((t, idx) => (
                              <span key={idx} style={{ fontSize: '11px', color: '#94a3b8', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '1px 6px', borderRadius: '4px' }}>
                                {t.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        {p.liveDemoUrl && p.liveDemoUrl !== '#' && (
                          <a
                            href={p.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: 'var(--accent-orange, #df6326)',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            Live Demo <ExternalLink size={12} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            router.push('/projects');
                          }}
                          style={{
                            backgroundColor: '#241913',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
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
          </div>
        </div>
      </div>
    );
  }

  // Regular inline render
  return (
    <div className={`global-search-bar ${className}`} style={{ width: '100%', marginBottom: '24px' }}>
      {searchInputContent}
    </div>
  );
}

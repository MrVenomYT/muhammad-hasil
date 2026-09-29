import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getCombinedProjects } from '../lib/storage';

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState('all');
  const [apiProjects, setApiProjects] = useState([]);
  const [firestoreProjects, setFirestoreProjects] = useState([]);

  useEffect(() => {
    // 1. Fetch from MongoDB API
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setApiProjects(data.data);
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

  // Merge MongoDB API projects, Firestore projects, and baseline cache
  const baseProjects = apiProjects.length > 0 ? apiProjects : getCombinedProjects(firestoreProjects);
  const mergedProjects = apiProjects.length > 0 && firestoreProjects.length > 0
    ? [...firestoreProjects, ...apiProjects.filter(ap => !firestoreProjects.some(fp => fp.id === ap.id || fp.title === ap.title))]
    : baseProjects;

  const filteredProjects = mergedProjects.filter(p => {
    if (filter === 'all') return true;
    return (p.category || '').includes(filter);
  });

  return (
    <div id="page-projects" className="page-view active">
      <section className="projects-section">
        <div className="projects-header">
          <div className="section-tag">
            <span className="orange-dot"></span>
            <span>Some Recent Projects</span>
          </div>
          <h2 className="section-title">Selected Work & Featured Projects</h2>

          {/* Filter Tabs */}
          <div className="projects-tabs-row" id="projects-tabs">
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
              Full Stack
            </button>
            <button
              className={`project-tab-btn ${filter === 'react' ? 'active' : ''}`}
              onClick={() => setFilter('react')}
            >
              React & Next.js
            </button>
            <button
              className={`project-tab-btn ${filter === 'design' ? 'active' : ''}`}
              onClick={() => setFilter('design')}
            >
              UI/UX & Web Design
            </button>
          </div>
        </div>

        {/* Web Projects Grid */}
        <div className="projects-grid" id="projects-grid">
          {filteredProjects.map((proj) => (
            <article key={proj.id} className="project-card" data-category={proj.category}>
              <div className="project-image-box">
                <img
                  src={formatImageUrl(proj.imageUrl)}
                  alt={proj.title}
                  className="project-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/muhammad-hasil.png';
                  }}
                />
                {proj.liveDemoUrl && (
                  <div className="project-overlay-link">
                    <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn-live-demo">
                      Live Demo <span className="arrow">↗</span>
                    </a>
                  </div>
                )}
              </div>
              <div className="project-info">
                <div className="project-info-header">
                  <h3 className="project-title">{proj.title}</h3>
                  <span className="project-pill">{proj.pill || 'Full Stack'}</span>
                </div>
                <p className="project-desc">{proj.description}</p>
                <div className="project-card-actions">
                  {proj.liveDemoUrl && (
                    <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn-live-demo-text">
                      Live Demo <span className="arrow">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tech Stack Marquee Banner */}
      <section className="tech-marquee-section">
        <div className="tech-marquee-track">
          <div className="tech-marquee-content">
            <span className="tech-brand-item"><span className="tech-star">✦</span> REACT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NEXT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIREBASE AUTH</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIRESTORE DB</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NODE.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> DISCORD API</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> MINECRAFT JAVA</span>
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            <span className="tech-brand-item"><span className="tech-star">✦</span> REACT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NEXT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIREBASE AUTH</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIRESTORE DB</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NODE.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> DISCORD API</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> MINECRAFT JAVA</span>
          </div>
        </div>
      </section>
    </div>
  );
}


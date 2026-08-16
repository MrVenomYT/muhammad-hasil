import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const initialSeedProjects = [
  {
    id: 'staypilot',
    title: 'StayPilot',
    category: 'fullstack react',
    pill: 'Full Stack Web App',
    description: 'All-in-one web platform for hospitality & property management, booking reservations, guest scheduling, and analytics.',
    liveDemoUrl: 'https://stay-pilot-liard.vercel.app/',
    imageUrl: '/assets/StayPilot.png'
  },
  {
    id: 'vscheduler',
    title: 'VScheduler',
    category: 'fullstack react',
    pill: 'React / Web App',
    description: 'Interactive appointment booking and automated scheduling system built for seamless workflow management.',
    liveDemoUrl: 'https://vscheduler-five.vercel.app/',
    imageUrl: '/assets/VScheduler.png'
  },
  {
    id: 'sushiman',
    title: 'Sushiman',
    category: 'design',
    pill: 'Web Design & UI',
    description: 'High-converting culinary website with authentic Japanese aesthetics, smooth scroll animations, and food ordering UI.',
    liveDemoUrl: 'https://vanilla-food-website.vercel.app/',
    imageUrl: '/assets/shushiman.png'
  },
  {
    id: 'coffee',
    title: 'Coffee Theme',
    category: 'design',
    pill: 'Artisanal Cafe Shop',
    description: 'Rich dark-themed website featuring artisanal coffee menus, online ordering, smooth scrolling, and brand aesthetics.',
    liveDemoUrl: 'https://coffee-theme.vercel.app/',
    imageUrl: '/assets/coffee.png'
  },
  {
    id: 'studyhub',
    title: 'Study Hub',
    category: 'fullstack react',
    pill: 'Learning Portal',
    description: 'Comprehensive educational application designed to help students organize study sessions, resources, and progress tracking.',
    liveDemoUrl: 'https://study-app-steel.vercel.app/',
    imageUrl: '/assets/Study-hub.png'
  },
  {
    id: 'venomousstudio',
    title: 'Venomous Studio',
    category: 'design react',
    pill: 'Digital Agency Showcase',
    description: 'Cutting-edge portfolio showcase for creative digital agency services, featuring glassmorphism UI and fluid animations.',
    liveDemoUrl: 'https://venomous-studio.vercel.app/',
    imageUrl: '/assets/Venomous Studio.png'
  }
];

export function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState('all');
  const [firestoreProjects, setFirestoreProjects] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    let unsubProjects = () => {};
    let unsubVideos = () => {};

    try {
      const refProjects = collection(db, 'projects');
      unsubProjects = onSnapshot(refProjects, (snapshot) => {
        const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreProjects(projs);
      }, (err) => {
        console.warn("Firestore projects snapshot notice:", err);
      });

      const refVideos = collection(db, 'youtube_videos');
      unsubVideos = onSnapshot(refVideos, (snapshot) => {
        const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setYoutubeVideos(vids);
      }, (err) => {
        console.warn("Firestore youtube_videos snapshot notice:", err);
      });
    } catch (e) {
      console.warn("Firestore connection notice:", e);
    }

    return () => {
      unsubProjects();
      unsubVideos();
    };
  }, []);

  const mergedProjects = [...firestoreProjects];
  initialSeedProjects.forEach(seed => {
    if (!mergedProjects.some(p => p.id === seed.id || (p.title && p.title.toLowerCase() === seed.title.toLowerCase()))) {
      mergedProjects.push(seed);
    }
  });

  const filteredProjects = mergedProjects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'youtube') return false;
    return (p.category || '').includes(filter);
  });

  const showYouTubeSection = filter === 'all' || filter === 'youtube';

  return (
    <div id="page-projects" className="page-view active">
      <section className="projects-section">
        <div className="projects-header">
          <div className="section-tag">
            <span className="orange-dot"></span>
            <span>Some Recent Projects</span>
          </div>
          <h2 className="section-title">Selected Work & Video Demos</h2>

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
            <button 
              className={`project-tab-btn ${filter === 'youtube' ? 'active' : ''}`} 
              onClick={() => setFilter('youtube')}
              style={{ color: '#ff4444', borderColor: filter === 'youtube' ? '#ff4444' : 'rgba(255,68,68,0.3)' }}
            >
              📹 YouTube Videos ({youtubeVideos.length})
            </button>
          </div>
        </div>

        {/* YouTube Video Section */}
        {showYouTubeSection && youtubeVideos.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <div className="section-tag" style={{ marginBottom: '15px' }}>
              <span className="orange-dot" style={{ backgroundColor: '#ff4444' }}></span>
              <span style={{ color: '#ffaa00' }}>FEATURED YOUTUBE VIDEOS</span>
            </div>
            <div className="projects-grid">
              {youtubeVideos.map((vid) => {
                const yId = getYouTubeId(vid.youtubeUrl || vid.youtubeId);
                const thumbUrl = vid.imageUrl || (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : '/assets/muhammad-hasil.png');
                return (
                  <article key={vid.id} className="project-card" style={{ border: '1px solid rgba(255, 68, 68, 0.3)' }}>
                    <div className="project-image-box" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveVideoModal(yId)}>
                      <img 
                        src={formatImageUrl(thumbUrl)} 
                        alt={vid.title} 
                        className="project-img" 
                        loading="lazy" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/muhammad-hasil.png';
                        }}
                      />
                      <div className="project-overlay-link" style={{ background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', boxShadow: '0 0 20px rgba(255,0,0,0.6)' }}>
                          ▶
                        </div>
                      </div>
                    </div>
                    <div className="project-info">
                      <div className="project-info-header">
                        <h3 className="project-title">{vid.title}</h3>
                        <span className="project-pill" style={{ backgroundColor: 'rgba(255,68,68,0.15)', color: '#ff6666', border: '1px solid rgba(255,68,68,0.3)' }}>
                          {vid.category || 'YouTube Video'}
                        </span>
                      </div>
                      <p className="project-desc">{vid.description}</p>
                      <div className="project-card-actions">
                        <button 
                          onClick={() => setActiveVideoModal(yId)} 
                          className="btn-live-demo-text" 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff7700', padding: 0 }}
                        >
                          Watch Video ▶
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Web Projects Grid */}
        {filter !== 'youtube' && (
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
                    {proj.youtubeUrl && (
                      <button 
                        onClick={() => setActiveVideoModal(getYouTubeId(proj.youtubeUrl))} 
                        className="btn-live-demo-text" 
                        style={{ marginLeft: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}
                      >
                        Watch Video ▶
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideoModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setActiveVideoModal(null)}
          >
            <div 
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '900px',
                aspectRatio: '16/9',
                backgroundColor: '#000',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,119,0,0.4)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveVideoModal(null)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal}?autoplay=1`}
                title="YouTube Video Player"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
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

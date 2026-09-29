import React, { useState, useEffect } from 'react';

const defaultAboutData = {
  headline: 'Clean web experiences with personality and purpose.',
  subtext: 'I am Muhammad Hasil, a full-stack developer who builds clean portfolio websites, interactive dashboards, scalable backend APIs, and responsive project experiences. I care about simple layouts, strong visual hierarchy, and interfaces that feel professional on every screen.',
  ctaText: 'Hire me on Fiverr',
  ctaLink: 'https://pro.fiverr.com/users/venomdesigne613/',
  skills: [
    { name: 'React.js', percentage: 94, category: 'Frontend' },
    { name: 'Next.js', percentage: 91, category: 'Frontend' },
    { name: 'Node.js', percentage: 88, category: 'Backend' },
    { name: 'Tailwind CSS', percentage: 96, category: 'Styling' },
    { name: 'Discord API & Bots', percentage: 95, category: 'Integration' },
    { name: 'Minecraft Development', percentage: 90, category: 'Gaming' },
    { name: 'MongoDB & PostgreSQL', percentage: 92, category: 'Database' }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'BS Business & Information Technology (BBIT)',
      institution: 'Virtual University of Pakistan',
      period: '2025 - Present',
      description: 'Currently pursuing BBIT, combining Information Technology and enterprise software systems. Focused on full-stack web engineering, database architecture, software development, and modern web application deployment.',
      certificationLink: 'https://www.vu.edu.pk'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Full Stack Developer',
      company: 'Freelance & Client Systems',
      period: '2024 - Present',
      description: 'Built responsive web apps, full-stack portfolio systems, interactive dashboards, custom APIs, Discord bots, Minecraft/Roblox integrations, and high-performance UI flows.',
      projectLink: 'https://pro.fiverr.com/users/venomdesigne613/'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Full-Stack Software Engineering & Modern Web Architecture',
      issuer: 'Verified Credential',
      date: '2024',
      link: 'https://www.linkedin.com/in/muhammad-hasil/'
    }
  ]
};

export default function AboutSection() {
  const [aboutData, setAboutData] = useState(defaultAboutData);

  useEffect(() => {
    // 1. Safe hydration from local cache
    try {
      const cached = localStorage.getItem('app_about_cache_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          // Normalize skills to ensure MongoDB & PostgreSQL
          if (Array.isArray(parsed.skills)) {
            parsed.skills = parsed.skills.map(s => {
              if (s.name === 'MongoDB & Mongoose') return { ...s, name: 'MongoDB & PostgreSQL' };
              return s;
            });
          }
          setAboutData(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {}

    // 2. Fresh fetch from API
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const fresh = { ...data.data };
          if (Array.isArray(fresh.skills)) {
            fresh.skills = fresh.skills.map(s => {
              if (s.name === 'MongoDB & Mongoose') return { ...s, name: 'MongoDB & PostgreSQL' };
              return s;
            });
          }
          setAboutData({
            ...defaultAboutData,
            ...fresh
          });
          try {
            localStorage.setItem('app_about_cache_v2', JSON.stringify(fresh));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div id="page-about" className="page-view active">
      <section className="about-section">
        {/* Main Intro Block */}
        <div className="about-hero">
          <div className="about-tag">
            <span className="orange-dot"></span>
            <span>ABOUT MUHAMMAD</span>
          </div>
          <h2 className="about-headline">
            {aboutData.headline}
          </h2>
          <p className="about-subtext">
            {aboutData.subtext}
          </p>

          {/* 4 Core Offerings Cards */}
          <div className="about-features-grid">
            <div className="feature-card">
              <div className="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Responsive full-stack development</span>
            </div>
            <div className="feature-card">
              <div className="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Admin dashboard systems & MongoDB</span>
            </div>
            <div className="feature-card">
              <div className="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Discord, Minecraft & Roblox APIs</span>
            </div>
            <div className="feature-card">
              <div className="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>Clean portfolio presentation</span>
            </div>
          </div>
        </div>

        {/* Dynamic Skills Sub-section */}
        <div className="skills-block">
          <div className="section-badge-center">
            <span className="badge-pill">SKILLS & TECHNOLOGIES</span>
          </div>
          <h2 className="skills-title">What I work with</h2>
          <p className="skills-subtitle">Specialized in modern full-stack web engineering, database architecture, and custom APIs.</p>

          <div className="skills-grid">
            {(aboutData.skills || defaultAboutData.skills).map((skill, idx) => (
              <div key={idx} className="skill-card">
                <div className="skill-header">
                  <div className="skill-title-row">
                    <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                  <span className="skill-percentage">{skill.percentage}%</span>
                </div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${skill.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education, Experience & Credentials Grid Sections */}
        <div className="info-blocks-container">
          {/* Education Block */}
          <div className="info-block">
            <div className="info-header-row">
              <span className="badge-pill">EDUCATION & ACADEMICS</span>
              <h2 className="info-block-title">Education</h2>
            </div>
            <div className="info-cards-grid">
              {(aboutData.education || []).map((edu, idx) => {
                const hasLink = Boolean(edu.certificationLink && edu.certificationLink.trim());
                return (
                  <div 
                    key={edu.id || idx} 
                    className="info-card"
                    style={{ cursor: hasLink ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (hasLink) {
                        window.open(edu.certificationLink, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <div className="info-card-corner-shape"></div>
                    <div className="info-card-top">
                      <div className="info-icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      </div>
                      <div className="info-badge-year">{edu.period || '2025 - Present'}</div>
                    </div>
                    <h3 className="info-card-heading">{edu.degree}</h3>
                    <p className="info-card-subheading">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M16 11h2M16 15h2M10 21V11h4v10M12 3l9 4H3l9-4z"/>
                      </svg>
                      <span>{edu.institution}</span>
                    </p>
                    <p className="info-card-desc">{edu.description}</p>
                    
                    {hasLink && (
                      <div className="info-card-footer">
                        <a 
                          href={edu.certificationLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-info-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Visit Institution</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Experience Block */}
          <div className="info-block">
            <div className="info-header-row">
              <span className="badge-pill">EXPERIENCE TIMELINE</span>
              <h2 className="info-block-title">Professional Experience</h2>
            </div>
            <div className="info-cards-grid">
              {(aboutData.experience || []).map((exp, idx) => {
                const hasLink = Boolean(exp.projectLink && exp.projectLink.trim());
                return (
                  <div 
                    key={exp.id || idx} 
                    className="info-card"
                    style={{ cursor: hasLink ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (hasLink) {
                        window.open(exp.projectLink, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <div className="info-card-corner-shape"></div>
                    <div className="info-card-top">
                      <div className="info-icon-wrapper">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </div>
                      <div className="info-badge-year">{exp.period || '2024 - Present'}</div>
                    </div>
                    <h3 className="info-card-heading">{exp.role}</h3>
                    <p className="info-card-subheading">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{exp.company}</span>
                    </p>
                    <p className="info-card-desc">{exp.description}</p>
                    
                    {hasLink && (
                      <div className="info-card-footer">
                        <a 
                          href={exp.projectLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-info-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>View Reference</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M7 17L17 7M17 7H7M17 7V17"/>
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certifications & Credentials Block */}
          {aboutData.certifications && aboutData.certifications.length > 0 && (
            <div className="info-block">
              <div className="info-header-row">
                <span className="badge-pill">CERTIFICATIONS & LICENSES</span>
                <h2 className="info-block-title">Professional Credentials</h2>
              </div>
              <div className="info-cards-grid">
                {aboutData.certifications.map((cert, idx) => {
                  const hasLink = Boolean(cert.link && cert.link.trim());
                  return (
                    <div 
                      key={cert.id || idx} 
                      className="info-card"
                      style={{ cursor: hasLink ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (hasLink) {
                          window.open(cert.link, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      <div className="info-card-corner-shape"></div>
                      <div className="info-card-top">
                        <div className="info-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.14)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15l-2 5l4 -2l4 2l-2 -5"></path>
                            <circle cx="12" cy="9" r="6"></circle>
                          </svg>
                        </div>
                        <div className="info-badge-year" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                          ✦ {cert.issuer} · {cert.date}
                        </div>
                      </div>
                      
                      <h3 className="info-card-heading" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                        {cert.title}
                      </h3>
                      
                      <p className="info-card-desc" style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                        Officially issued and verified credential in modern software architecture, engineering standards, and web systems.
                      </p>

                      {hasLink && (
                        <div className="info-card-footer">
                          <a 
                            href={cert.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-info-link"
                            style={{ color: '#10b981' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Verify Credential</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

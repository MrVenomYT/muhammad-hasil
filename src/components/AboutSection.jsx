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
    { name: 'MongoDB & Mongoose', percentage: 92, category: 'Database' }
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
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAboutData({
            ...defaultAboutData,
            ...data.data
          });
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

        {/* Education & Experience Stack */}
        <div className="info-blocks-container">
          {/* Education Block */}
          <div className="info-block">
            <div className="info-header-row">
              <span className="badge-pill">EDUCATION & ACADEMICS</span>
              <h2 className="info-block-title">Education</h2>
            </div>
            <div className="experience-cards-stack">
              {(aboutData.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="info-card">
                  <div className="info-card-corner-shape"></div>
                  <div className="info-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <div className="info-badge-year">{edu.period || '2025 - Present'}</div>
                  <h3 className="info-card-heading">{edu.degree}</h3>
                  <p className="info-card-subheading">{edu.institution}</p>
                  <p className="info-card-desc">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Block */}
          <div className="info-block">
            <div className="info-header-row">
              <span className="badge-pill">EXPERIENCE TIMELINE</span>
              <h2 className="info-block-title">Professional Experience</h2>
            </div>
            <div className="experience-cards-stack">
              {(aboutData.experience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="info-card">
                  <div className="info-card-corner-shape"></div>
                  <div className="info-badge-year">{exp.period || '2024 - Present'}</div>
                  <h3 className="info-card-heading">{exp.role}</h3>
                  <p className="info-card-subheading">{exp.company}</p>
                  <p className="info-card-desc">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications & Credentials Section */}
        {aboutData.certifications && aboutData.certifications.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <div className="section-badge-center">
              <span className="badge-pill">CERTIFICATIONS & LICENSES</span>
            </div>
            <h2 className="skills-title" style={{ textAlign: 'center' }}>Professional Credentials</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '28px' }}>
              {aboutData.certifications.map((cert, idx) => (
                <div key={cert.id || idx} style={{
                  backgroundColor: 'rgba(18, 16, 14, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>✦ {cert.issuer} · {cert.date}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '8px 0 0 0' }}>{cert.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

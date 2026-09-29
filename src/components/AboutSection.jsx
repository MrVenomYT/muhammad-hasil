import React from 'react';
import { useAbout } from '../lib/usePortfolioData';
import { InfoGridSkeleton, GlobalLoadingBar } from './SkeletonLoader';

const defaultAboutData = {
  headline: 'Sales Engineer | Lead Generation and Data Mining | Hindi Translator | Discord Mod Expert | Skilled in Discord.js and Custom Integrations | Mern Stack Developer | Freelancer | AI Vibe Coding',
  subtext: 'I am a Front End Web Developer with over 5 years of experience building fast, responsive, and user focused web applications. I work with HTML5, CSS3, Bootstrap, JavaScript, jQuery, and React Redux to deliver clean, scalable, and high performing interfaces.\n\nI also bring full stack experience with the MERN stack including MongoDB, Express.js, React.js, and Node.js, which allows me to support projects from frontend development to backend logic and deployment. WordPress is a major part of my current stack, where I build and manage custom themes, plugins, and performance optimized websites for businesses and agencies.\n\nAlongside development, I have strong experience in B2B and B2C sales, LinkedIn lead generation, and data mining. I understand how to identify ideal prospects, generate qualified leads, and align technical solutions with business and revenue goals. This makes me especially valuable for startups, agencies, and founders looking for both technical execution and growth support.\n\nI have also worked with Discord.js and quick.db to build Discord bots for automation, moderation, and community engagement. In addition, I currently work with Lunar Client as a Hindi Translator, helping expand reach and accessibility within a global community.\n\nI am focused on problem solving, clear communication, and delivering results. I help businesses turn ideas into reliable, scalable products that drive growth.',
  ctaText: 'Hire me on Fiverr',
  ctaLink: 'https://pro.fiverr.com/users/venomdesigne613/',
  skills: [
    { name: 'React.js', percentage: 94, category: 'Frontend', _id: '6abbe223b095e8e372b6d5d5' },
    { name: 'Next.js', percentage: 91, category: 'Frontend', _id: '6abbe223b095e8e372b6d5d6' },
    { name: 'Node.js', percentage: 88, category: 'Backend', _id: '6abbe223b095e8e372b6d5d7' },
    { name: 'Tailwind CSS', percentage: 96, category: 'Styling', _id: '6abbe223b095e8e372b6d5d8' },
    { name: 'Discord API & Bots', percentage: 95, category: 'Integration', _id: '6abbe223b095e8e372b6d5d9' },
    { name: 'Minecraft Development', percentage: 90, category: 'Gaming', _id: '6abbe223b095e8e372b6d5da' },
    { name: 'MongoDB & PostgreSQL', percentage: 92, category: 'Database', _id: '6abbe223b095e8e372b6d5db' }
  ],
  education: [
    {
      degree: 'Matric (Computer Science)',
      institution: 'Al-Qalam High School',
      period: '2010 - 2012',
      description: 'Completed Matric in computer science',
      certificationLink: '',
      _id: '6abc008fcb970af861a20871'
    },
    {
      degree: 'Intermediate (Ics)',
      institution: 'CIMS (Central Group Of Colleges',
      period: '2014 - 2016',
      description: 'Completed Intermediate in ICS',
      certificationLink: '',
      _id: '6abc008fcb970af861a20872'
    },
    {
      degree: 'BS Business & Information Technology (BBIT)',
      institution: 'Virtual University of Pakistan',
      period: '2025 - Present',
      description: 'Currently pursuing BBIT, combining Information Technology and enterprise software systems. Focused on full-stack web engineering, database architecture, software development, and modern web application deployment.',
      certificationLink: 'https://www.vu.edu.pk',
      _id: '6abbe223b095e8e372b6d5dc'
    }
  ],
  experience: [
    {
      role: 'Wordpress Developer',
      company: 'Freelance',
      period: '2016 - 2018',
      description: 'Complete 500+ private project with multiple clients',
      projectLink: '',
      _id: '6abc008fcb970af861a20874'
    },
    {
      role: 'Sales Engineer / B2B Leads',
      company: 'Esp Inspire',
      period: '2024 - Present',
      description: 'Working as Sales Eng / B2B Lead Generation / Email Automation / Data Miner',
      projectLink: '',
      _id: '6abc008fcb970af861a20875'
    },
    {
      role: 'Computer Operator - Inventory & Warehouse Management',
      company: 'Kamal Limited',
      period: '3 Months',
      description: 'Managed inventory records and maintained accurate stock data using computer-based systems.\nHandled data entry, inventory tracking, stock updates, and daily documentation efficiently.\nSupported warehouse operations by ensuring timely and organized inventory management.',
      projectLink: '',
      _id: '6abc008fcb970af861a20876'
    },
    {
      role: 'Customer Support / Data Miner / Backend Manager',
      company: 'Quantum LHE',
      period: '2019 - 2021',
      description: 'Managed daily Shopify store operations, including product listings, inventory updates, orders, and store maintenance.\nHandled customer support, responded to inquiries, and resolved order-related issues professionally.\nMonitored orders and ensured smooth coordination between customers, products, and fulfillment.',
      projectLink: '',
      _id: '6abc008fcb970af861a20877'
    },
    {
      role: 'Full Stack Developer',
      company: 'Freelance & Client Systems',
      period: '2024 - Present',
      description: 'Built responsive web apps, full-stack portfolio systems, interactive dashboards, custom APIs, Discord bots, Minecraft/Roblox integrations, and high-performance UI flows.',
      projectLink: 'https://pro.fiverr.com/users/venomdesigne613/',
      _id: '6abbe223b095e8e372b6d5dd'
    }
  ],
  certifications: [
    {
      title: 'Technical Sales',
      issuer: 'John Care',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/5fdb0df8d0d818233c6fd949d93dd1a19fed1810b65089ce616c79c69d860274',
      _id: '6abc09328d6d3360ae209ba1'
    },
    {
      title: 'Salesforce: Sales Automation for Salespeople',
      issuer: 'Christine Volden',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/919a525db2af917e227508a1acf83d9a6a728fd792a707a5d3724f5f53da9f72',
      _id: '6abc09328d6d3360ae209ba2'
    },
    {
      title: 'Program Databases with Transact-SQL',
      issuer: 'Adam Wilbert',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/a7691b4007228f21ae4e4c0f6b0837d5a5e4707547eb1c905a974b8d3e3d5c09',
      _id: '6abc09328d6d3360ae209ba3'
    },
    {
      title: 'Project Management Foundations',
      issuer: 'Bonnie Biafore',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/169d2cf06c18bf265649f7da6a144ac9d7b544f575a8bc7a77aa946cf4712201',
      _id: '6abc09328d6d3360ae209ba4'
    },
    {
      title: 'Advanced Product Marketing',
      issuer: 'Jonathan Chang',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/f8e6621a64acbf7d9d9e5c80cb7f6a9cf3e35ad73d66f0b8363c52f69910b0d3',
      _id: '6abc09328d6d3360ae209ba5'
    },
    {
      title: 'PMI - Project Management Professional (PMP)®',
      issuer: 'Total Seminars',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/cce119d92c617dac81812ed1797893fe59d984bd6153e9ed828a4167ae31610a',
      _id: '6abc09328d6d3360ae209ba6'
    },
    {
      title: 'Full-Stack Software Engineering & Modern Web Architecture',
      issuer: 'Samer Buna',
      date: '2025',
      link: 'https://www.linkedin.com/learning/certificates/5235036d3988c62e762dffdcf4a88084150c6c88f341761a5897c8ccdaa43a70',
      _id: '6abbe223b095e8e372b6d5de'
    }
  ]
};

export default function AboutSection() {
  const { about, isValidating, isLoading } = useAbout(defaultAboutData);
  const aboutData = about || defaultAboutData;

  // Format headline gracefully if user supplied multiple piped titles
  const headlineText = aboutData.headline || defaultAboutData.headline;
  const isPipedHeadline = headlineText.includes('|');
  const headlineParts = isPipedHeadline ? headlineText.split('|').map(p => p.trim()).filter(Boolean) : [];
  const primaryTitle = isPipedHeadline ? headlineParts.slice(0, 2).join(' & ') : headlineText;
  const subRoles = isPipedHeadline ? headlineParts.slice(2) : [];

  return (
    <div id="page-about" className="page-view active">
      <section className="about-section">
        {/* Main Intro Block with Frosted Glass Backdrop */}
        <div className="about-hero">
          <div className="about-hero-corner"></div>
          <div className="about-tag">
            <span className="orange-dot"></span>
            <span>ABOUT MUHAMMAD</span>
          </div>

          <h1 className="about-headline">
            {primaryTitle}
          </h1>

          {subRoles.length > 0 && (
            <div className="about-pills-row">
              {subRoles.map((role, idx) => (
                <span key={idx} className="about-role-pill">
                  ✦ {role}
                </span>
              ))}
            </div>
          )}

          <div className="about-subtext">
            {(aboutData.subtext || defaultAboutData.subtext)
              .split('\n\n')
              .map((para, i) => (
                <p key={i} style={{ margin: i > 0 ? '14px 0 0 0' : '0', color: '#ffffff', fontSize: '1.05rem', lineHeight: 1.8 }}>
                  {para}
                </p>
              ))}
          </div>

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
                      
                      <p className="info-card-desc" style={{ fontSize: '0.86rem', color: '#f4f4f5', opacity: 0.95 }}>
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

      {/* SWR Background Syncing Indicator */}
      <GlobalLoadingBar active={isValidating} />
    </div>
  );
}

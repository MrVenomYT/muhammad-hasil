import React from 'react';

export default function AboutSection() {
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
            Clean web experiences with personality and purpose.
          </h2>
          <p className="about-subtext">
            I am Muhammad Hasil, a full-stack developer who builds clean portfolio websites, interactive dashboards,
            scalable backend APIs, and responsive project experiences. I care about simple layouts, strong visual
            hierarchy, and interfaces that feel professional on every screen.
          </p>
          <div className="about-cta-row">
            <a href="https://pro.fiverr.com/users/venomdesigne613/" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Hire me on Fiverr <span className="arrow">↗</span>
            </a>
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
              <span>Admin dashboard systems</span>
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

        {/* Skills Sub-section */}
        <div className="skills-block">
          <div className="section-badge-center">
            <span className="badge-pill">SKILLS & TECHNOLOGIES</span>
          </div>
          <h2 className="skills-title">What I work with</h2>
          <p className="skills-subtitle">Specialized in modern full-stack web engineering, custom APIs, and gaming platforms.</p>

          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-header">
                <div className="skill-title-row">
                  <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                  <span className="skill-name">React.js</span>
                </div>
                <span className="skill-percentage">94%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <div className="skill-title-row">
                  <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <span className="skill-name">Next.js</span>
                </div>
                <span className="skill-percentage">91%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: '91%' }}></div>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <div className="skill-title-row">
                  <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
                    <line x1="8" y1="16" x2="8.01" y2="16"></line>
                  </svg>
                  <span className="skill-name">Node.js</span>
                </div>
                <span className="skill-percentage">88%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <div className="skill-title-row">
                  <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  <span className="skill-name">Tailwind CSS</span>
                </div>
                <span className="skill-percentage">96%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <div className="skill-title-row">
                  <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span className="skill-name">Discord API & Bots</span>
                </div>
                <span className="skill-percentage">95%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="skill-card">
              <div className="skill-header">
                <div className="skill-title-row">
                  <svg className="tech-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <span className="skill-name">Minecraft Development</span>
                </div>
                <span className="skill-percentage">90%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="info-blocks-container">
          <div className="info-block">
            <div className="info-header-row">
              <span className="badge-pill">INFORMATION</span>
              <h2 className="info-block-title">Education</h2>
            </div>
            <div className="info-card">
              <div className="info-card-corner-shape"></div>
              <div className="info-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div className="info-badge-year">2025 - Present</div>
              <h3 className="info-card-heading">BS Business & Information Technology (BBIT)</h3>
              <p className="info-card-subheading">Virtual University of Pakistan</p>
              <p className="info-card-desc">
                Currently pursuing BBIT, combining Information Technology and enterprise software systems. Focused on full-stack web engineering, database architecture, software development, and modern web application deployment.
              </p>
            </div>
          </div>

          <div className="info-block">
            <div className="info-header-row">
              <span className="badge-pill">EXPERIENCE TIMELINE</span>
              <h2 className="info-block-title">Current & Past Experience</h2>
            </div>
            <div className="experience-cards-stack">
              <div className="info-card">
                <div className="info-card-corner-shape"></div>
                <div className="info-badge-year">2024 - Present</div>
                <h3 className="info-card-heading">Full Stack Developer</h3>
                <p className="info-card-subheading">Freelance & Client Systems</p>
                <p className="info-card-desc">Built responsive web apps, full-stack portfolio systems, interactive dashboards, custom APIs, Discord bots, Minecraft/Roblox integrations, and high-performance UI flows.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

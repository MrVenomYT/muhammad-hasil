import React from 'react';

export default function ServicesSection() {
  return (
    <div id="page-services" className="page-view active">
      <section className="services-section">
        <div className="section-tag">
          <span className="orange-dot"></span>
          <span>EXPERTISE & SERVICES</span>
        </div>
        <h2 className="section-title">Solutions Built For Growth & Scale</h2>
        <p className="section-subtitle-desc">Comprehensive web development, digital platform customization, bot development, and server infrastructure solutions.</p>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3 className="service-title">Full Stack Web Development</h3>
            <p className="service-desc">End-to-end, high-performance web applications built using React, Next.js, Node.js, databases, custom REST APIs, and modern CSS.</p>
            <span className="service-pill">Web Apps & APIs</span>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <h3 className="service-title">Multimedia & Web Design</h3>
            <p className="service-desc">Clean visual hierarchy, responsive UI/UX design, custom visual media assets, brand graphics, and interactive web templates.</p>
            <span className="service-pill">UI/UX & Branding</span>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="service-title">Website Audit & Optimization</h3>
            <p className="service-desc">In-depth technical code audits, Core Web Vitals performance tuning, accessibility compliance, and SEO optimization.</p>
            <span className="service-pill">SEO & Speed</span>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </div>
            <h3 className="service-title">Lead Generation & CRO</h3>
            <p className="service-desc">Conversion Rate Optimization (CRO) landing pages, user behavior analysis, and lead capture funnels engineered to convert visitors into clients.</p>
            <span className="service-pill">Growth & Sales</span>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8" y2="16.01"></line>
                <line x1="16" y1="16" x2="16" y2="16.01"></line>
              </svg>
            </div>
            <h3 className="service-title">Discord Bot Development</h3>
            <p className="service-desc">Custom Discord bots built with Node.js / Python featuring automated moderation, ticketing, verification, custom commands, and database integration.</p>
            <span className="service-pill">Bot Automation</span>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
              </svg>
            </div>
            <h3 className="service-title">Gaming Platforms & Webstores</h3>
            <p className="service-desc">Custom Tebex webstore themes, Minecraft Paper/Spigot setups, Roblox API leaderboards, and gaming community dashboards.</p>
            <span className="service-pill">Gaming Systems</span>
          </div>
        </div>
      </section>
    </div>
  );
}

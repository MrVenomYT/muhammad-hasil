import React from 'react';
import ProjectShowcase from './ProjectShowcase';

export default function ProjectsSection({ initialProjects = [] }) {
  return (
    <div id="page-projects" className="page-view active">
      <ProjectShowcase initialProjects={initialProjects} showMetrics={true} />

      {/* Tech Stack Marquee Banner */}
      <section className="tech-marquee-section">
        <div className="tech-marquee-track">
          <div className="tech-marquee-content">
            <span className="tech-brand-item"><span className="tech-star">✦</span> REACT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NEXT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> MONGODB ATLAS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NODE.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIREBASE AUTH</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> TAILWIND CSS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> RESTFUL APIS</span>
          </div>
          <div className="tech-marquee-content" aria-hidden="true">
            <span className="tech-brand-item"><span className="tech-star">✦</span> REACT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NEXT.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> MONGODB ATLAS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> NODE.JS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> FIREBASE AUTH</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> TAILWIND CSS</span>
            <span className="tech-brand-item"><span className="tech-star">✦</span> RESTFUL APIS</span>
          </div>
        </div>
      </section>
    </div>
  );
}

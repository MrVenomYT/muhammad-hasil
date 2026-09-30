import React from 'react';
import Link from 'next/link';
import { getProjects } from '../../lib/server-store';
import { generateSEOMetadata } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import { formatImageUrl } from '../../components/ProjectShowcase';

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.id === id || p._id === id || p.title?.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase());

    if (!project) {
      return {
        notFound: true
      };
    }

    const seo = generateSEOMetadata({
      title: project.title,
      description: project.description || `Explore ${project.title}, a high-performance web application built with ${Array.isArray(project.technologies) ? project.technologies.join(', ') : 'React and Next.js'}.`,
      imageUrl: project.imageUrl,
      url: `https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/projects/${project.id || project._id}`,
      type: 'article',
      category: project.category || 'Full Stack Web Development',
      schemaType: 'SoftwareApplication',
      schemaData: {
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All',
        featureList: Array.isArray(project.technologies) ? project.technologies : ['React', 'Next.js', 'Node.js']
      }
    });

    return {
      props: {
        project: JSON.parse(JSON.stringify(project)),
        seo
      }
    };
  } catch (error) {
    console.error('Error loading project page:', error);
    return {
      notFound: true
    };
  }
}

export default function ProjectDetailPage({ project, seo }) {
  if (!project) return null;

  return (
    <>
      <SEOHead seo={seo} />
      <div id="page-project-detail" className="page-view active" style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/projects" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#a1a1aa',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease'
          }}>
            ← Back to All Projects
          </Link>
        </div>

        <div className="info-card" style={{ padding: '36px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="project-pill" style={{ display: 'inline-block', marginBottom: '12px', background: 'rgba(255, 119, 0, 0.15)', color: '#ff7700', border: '1px solid rgba(255, 119, 0, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                  {project.pill || 'Full Stack App'}
                </span>
                <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                  {project.title}
                </h1>
              </div>

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    borderRadius: '14px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Live Preview ↗
                </a>
              )}
            </div>

            <p style={{ fontSize: '18px', color: '#e4e4e7', lineHeight: 1.6, margin: 0 }}>
              {project.description}
            </p>

            {project.longDescription && (
              <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.7, margin: 0 }}>
                {project.longDescription}
              </p>
            )}

            {/* Project Image Preview */}
            <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', margin: '12px 0' }}>
              <img
                src={formatImageUrl(project.imageUrl)}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Tech Stack Chips */}
            <div>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Technologies Used
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Array.isArray(project.technologies) && project.technologies.map((tech, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 500
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

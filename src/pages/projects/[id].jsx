import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProjects } from '../../lib/server-store';
import { initialSeedProjects } from '../../lib/storage';
import { generateSEOMetadata } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';
import { formatImageUrl } from '../../components/ProjectsSection';
import TechStack from '../../components/TechStack';
import ProjectMetrics from '../../components/ProjectMetrics';
import { ArrowLeft, ExternalLink, Github, Mail } from 'lucide-react';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export async function getServerSideProps(context) {
  const rawId = context.params?.id || '';
  const decodedId = decodeURIComponent(rawId).trim();

  try {
    let projects = [];
    try {
      projects = await getProjects();
    } catch (dbErr) {
      console.warn('MongoDB getProjects note in detail view:', dbErr.message);
    }

    if (!Array.isArray(projects) || projects.length === 0) {
      projects = initialSeedProjects;
    }

    const clean = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const slugify = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const targetClean = clean(decodedId);
    const targetSlug = slugify(decodedId);

    // 1. Primary matching criteria
    let project = projects.find((p) => {
      if (!p) return false;
      const pId = String(p.id || p._id || p.customId || '');
      const pSlug = String(p.slug || slugify(p.title || ''));
      const pTitle = p.title || '';

      return (
        pId === decodedId ||
        pId.toLowerCase() === decodedId.toLowerCase() ||
        pSlug === targetSlug ||
        pSlug === decodedId.toLowerCase() ||
        clean(pId) === targetClean ||
        slugify(pTitle) === targetSlug ||
        clean(pTitle) === targetClean ||
        pTitle.toLowerCase() === decodedId.toLowerCase()
      );
    });

    // 2. Secondary fuzzy matching criteria
    if (!project) {
      project = projects.find((p) => {
        if (!p || !p.title) return false;
        const pSlug = slugify(p.title);
        return pSlug.includes(targetSlug) || targetSlug.includes(pSlug) || clean(p.title).includes(targetClean);
      });
    }

    // 3. Graceful handling if not found
    if (!project) {
      if (context.res) {
        context.res.statusCode = 404;
      }
      return {
        props: {
          project: null,
          requestedId: decodedId,
          suggestedProjects: projects.slice(0, 4).map(p => ({
            id: p.id || p._id,
            title: p.title,
            category: p.category,
            imageUrl: p.imageUrl,
            pill: p.pill,
            description: p.description
          })),
          seo: generateSEOMetadata({
            title: 'Project Not Found | Portfolio',
            description: 'The requested project could not be found.'
          })
        }
      };
    }

    const seo = generateSEOMetadata({
      title: `${project.title} | Full Stack Case Study`,
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
        suggestedProjects: projects.filter(p => (p.id || p._id) !== (project.id || project._id)).slice(0, 3).map(p => ({
          id: p.id || p._id,
          title: p.title,
          category: p.category,
          imageUrl: p.imageUrl,
          pill: p.pill
        })),
        seo
      }
    };
  } catch (error) {
    console.error('Error in project detail getServerSideProps:', error);
    if (context.res) {
      context.res.statusCode = 404;
    }
    return {
      props: {
        project: null,
        requestedId: decodedId,
        suggestedProjects: initialSeedProjects.slice(0, 3),
        seo: generateSEOMetadata({
          title: 'Project Not Found | Portfolio',
          description: 'The requested project could not be found.'
        })
      }
    };
  }
}

export default function ProjectDetailPage({ project, requestedId, suggestedProjects = [], seo }) {
  // If project not found, render a branded and graceful not-found view with entrance animation
  if (!project) {
    return (
      <>
        <SEOHead seo={seo} />
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}
        >
          <div style={{ backgroundColor: '#120f0d', border: '1px solid rgba(255, 119, 0, 0.25)', borderRadius: '24px', padding: '48px 24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#ff7700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Project Reference Not Found
            </span>
            <h1 style={{ fontSize: '28px', color: '#ffffff', margin: '12px 0 16px', fontWeight: 800 }}>
              No project found matching &ldquo;{requestedId || 'unknown'}&rdquo;
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '520px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              The project might have been updated or moved. Browse all production projects below or return to the main project catalog.
            </p>
            <Link
              href="/projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ff7700',
                color: '#ffffff',
                padding: '12px 26px',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(255, 119, 0, 0.4)'
              }}
            >
              <ArrowLeft size={16} />
              <span>Browse All Portfolio Projects</span>
            </Link>

            {suggestedProjects.length > 0 && (
              <div style={{ marginTop: '40px', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px' }}>
                <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '16px', fontWeight: 700 }}>
                  Suggested Featured Projects:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                  {suggestedProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      style={{
                        backgroundColor: '#181412',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '14px',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'transform 0.2s ease, border-color 0.2s ease'
                      }}
                    >
                      <img
                        src={formatImageUrl(p.imageUrl)}
                        alt={p.title}
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <strong style={{ color: '#ffffff', fontSize: '14px' }}>{p.title}</strong>
                      <span style={{ fontSize: '12px', color: '#ff7700' }}>{p.pill || p.category}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <SEOHead seo={seo} />
      <motion.div 
        id="page-project-detail" 
        className="page-view active" 
        style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Navigation Breadcrumb Bar */}
        <motion.div 
          variants={fadeUpVariant}
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
        >
          <Link
            href="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#a1a1aa',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: '12px',
              background: '#161311',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Projects</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '6px 14px', borderRadius: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            <span>Production Verified Full-Stack Build</span>
          </div>
        </motion.div>

        {/* Main Project Container Card */}
        <motion.div 
          className="info-card" 
          variants={fadeUpVariant}
          style={{ 
            padding: '36px', 
            borderRadius: '24px',
            backgroundColor: '#120f0d',
            border: '1px solid rgba(255, 119, 0, 0.22)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header: Title, Category Pill, and Action CTAs */}
            <motion.div 
              variants={fadeUpVariant}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span 
                    className="project-pill" 
                    style={{ 
                      background: 'rgba(255, 119, 0, 0.15)', 
                      color: '#ff7700', 
                      border: '1px solid rgba(255, 119, 0, 0.35)', 
                      padding: '4px 14px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: 700 
                    }}
                  >
                    {project.pill || 'Full Stack Web App'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    • {project.category || 'Engineering'}
                  </span>
                </div>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                  {project.title}
                </h1>
              </div>

              {/* Action Buttons: Live Preview, GitHub, and Inquire */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 22px',
                      backgroundColor: '#ff7700',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(255, 119, 0, 0.4)'
                    }}
                  >
                    <span>Live Preview</span>
                    <ExternalLink size={15} />
                  </a>
                )}

                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '14px',
                      textDecoration: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <Github size={15} />
                    <span>Source Code</span>
                  </a>
                )}

                <Link
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'transparent',
                    color: '#ff7700',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 119, 0, 0.4)'
                  }}
                >
                  <Mail size={15} />
                  <span>Build Similar App</span>
                </Link>
              </div>
            </motion.div>

            {/* Project Overview Descriptions */}
            <motion.p 
              variants={fadeUpVariant}
              style={{ fontSize: '18px', color: '#e4e4e7', lineHeight: 1.6, margin: 0, fontWeight: 400 }}
            >
              {project.description}
            </motion.p>

            {project.longDescription && (
              <motion.p 
                variants={fadeUpVariant}
                style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.7, margin: 0, backgroundColor: '#181412', padding: '18px 22px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                {project.longDescription}
              </motion.p>
            )}

            {/* Project Image Preview Banner */}
            <motion.div 
              variants={fadeUpVariant}
              style={{ 
                position: 'relative', 
                width: '100%', 
                height: '420px', 
                borderRadius: '18px', 
                overflow: 'hidden', 
                border: '1px solid rgba(255, 255, 255, 0.12)', 
                margin: '8px 0',
                backgroundColor: '#000000',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)'
              }}
            >
              <img
                src={formatImageUrl(project.imageUrl)}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/muhammad-hasil.png';
                }}
              />
            </motion.div>

            {/* Interactive Tech Stack Section with Icons and Hover Effects */}
            <motion.div variants={fadeUpVariant}>
              <TechStack 
                technologies={project.technologies} 
                projectTitle={project.title} 
              />
            </motion.div>

            {/* Project Metrics & Engagement Visualization (Recharts) */}
            <motion.div variants={fadeUpVariant}>
              <ProjectMetrics project={project} />
            </motion.div>

            {/* Related Projects Bar */}
            {suggestedProjects.length > 0 && (
              <motion.div 
                variants={fadeUpVariant}
                style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                    Other Full-Stack Systems
                  </h4>
                  <Link href="/projects" style={{ fontSize: '13px', color: '#ff7700', textDecoration: 'none', fontWeight: 600 }}>
                    View All ↗
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {suggestedProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      style={{
                        backgroundColor: '#161311',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '12px',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'border-color 0.2s ease, transform 0.2s ease'
                      }}
                    >
                      <img
                        src={formatImageUrl(p.imageUrl)}
                        alt={p.title}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#ff7700' }}>
                          {p.pill || p.category}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

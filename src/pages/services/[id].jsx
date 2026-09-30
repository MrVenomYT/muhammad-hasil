import React from 'react';
import Link from 'next/link';
import { getServices } from '../../lib/server-store';
import { generateSEOMetadata } from '../../lib/seo';
import SEOHead from '../../components/SEOHead';

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const services = await getServices();
    const service = services.find(s => s.id === id || s._id === id || s.title?.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase());

    if (!service) {
      return {
        notFound: true
      };
    }

    const seo = generateSEOMetadata({
      title: service.title,
      description: service.description || `Professional ${service.title} services provided by Muhammad Hasil. High-quality web engineering, API integration, and user interface design.`,
      imageUrl: service.imageUrl || '/assets/muhammad-hasil.png',
      url: `https://ais-dev-bezdre5xkoaykqoxpsuxtr-268579460420.asia-southeast1.run.app/services/${service.id || service._id}`,
      type: 'article',
      category: 'Software Engineering Services',
      schemaType: 'Service',
      schemaData: {
        serviceType: service.title,
        provider: {
          '@type': 'Person',
          name: 'Muhammad Hasil',
          url: 'https://pro.fiverr.com/users/venomdesigne613/'
        }
      }
    });

    return {
      props: {
        service: JSON.parse(JSON.stringify(service)),
        seo
      }
    };
  } catch (error) {
    console.error('Error loading service detail page:', error);
    return {
      notFound: true
    };
  }
}

export default function ServiceDetailPage({ service, seo }) {
  if (!service) return null;

  return (
    <>
      <SEOHead seo={seo} />
      <div id="page-service-detail" className="page-view active" style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/services" style={{
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
            ← Back to All Services
          </Link>
        </div>

        <div className="info-card" style={{ padding: '36px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="project-pill" style={{ display: 'inline-block', marginBottom: '12px', background: 'rgba(255, 119, 0, 0.15)', color: '#ff7700', border: '1px solid rgba(255, 119, 0, 0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                Service Showcase
              </span>
              <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                {service.title}
              </h1>
            </div>

            <p style={{ fontSize: '18px', color: '#e4e4e7', lineHeight: 1.6, margin: 0 }}>
              {service.description}
            </p>

            {Array.isArray(service.features) && service.features.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '12px', fontWeight: 600 }}>
                  Service Offerings & Deliverables:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#d4d4d8',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#ff7700', fontWeight: 'bold' }}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <a
                href="https://pro.fiverr.com/users/venomdesigne613/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  backgroundColor: '#ff7700',
                  color: '#ffffff',
                  borderRadius: '14px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Request Service on Fiverr ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

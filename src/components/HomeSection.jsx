import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReviews, useStats, useProjects } from '../lib/usePortfolioData';
import { GlobalLoadingBar } from './SkeletonLoader';
import ProjectGrid from './ProjectGrid';
import { initialSeedProjects } from '../lib/storage';
import TestimonialSlider from './TestimonialSlider';
import NewsletterSubscription from './NewsletterSubscription';
import ContactForm from './ContactForm';

export function formatImageUrl(url) {
  if (!url) return '/assets/muhammad-hasil.png';
  if (url.startsWith('/')) return encodeURI(url);
  if (url.startsWith('http://') || url.startsWith('https://')) return encodeURI(url);
  return encodeURI('/' + url);
}

const defaultReviewsData = [
  {
    quote: "Muhammad delivered our Next.js and React web application faster than expected with incredible attention to detail, clean full-stack code, and smooth animations.",
    author: "Sarah K.",
    role: "Digital Marketing Director",
    initials: "SK",
    tech: "Next.js & React"
  },
  {
    quote: "The interactive admin dashboard and database persistence he built transformed how our client operations work. Highly recommended for any serious web project.",
    author: "David M.",
    role: "SaaS Founder",
    initials: "DM",
    tech: "MongoDB & Node.js"
  },
  {
    quote: "Outstanding full-stack engineering precision, Firebase authentication integration, and flawless responsiveness across all desktop and mobile devices. A true professional.",
    author: "Alex R.",
    role: "E-Commerce Lead",
    initials: "AR",
    tech: "Firebase & Security"
  },
  {
    quote: "He transformed our brand UI with stunning modern design, smooth scroll physics, and fast Next.js performance. Exceptional quality throughout.",
    author: "Elena V.",
    role: "Creative Director",
    initials: "EV",
    tech: "UI/UX & Web Design"
  },
  {
    quote: "Flawless real-time data sync and clean RESTful API integration. His expertise in full-stack architecture saved us weeks of development time.",
    author: "Marcus T.",
    role: "CTO at TechFlow",
    initials: "MT",
    tech: "Full-Stack Architecture"
  },
  {
    quote: "The digital product store and payment workflows he engineered were rock-solid. 100% persistent data even across hard reloads.",
    author: "Brandon P.",
    role: "Product Manager",
    initials: "BP",
    tech: "Next.js & API Routes"
  }
];

export default function HomeSection({ initialReviews = [], initialProjects = [] }) {
  const [typedText, setTypedText] = useState('MUHAMMAD HASIL');
  const textToType = "MUHAMMAD HASIL";
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const fallbackRev = (Array.isArray(initialReviews) && initialReviews.length > 0) ? initialReviews : defaultReviewsData;

  // SWR caching hooks for instant cached display and background revalidation
  const { reviews: swrReviews, isValidating: reviewsValidating } = useReviews(fallbackRev);
  const { stats: portfolioStats, isValidating: statsValidating } = useStats();
  const { projects: swrProjects } = useProjects(initialProjects);

  const reviewsList = Array.isArray(swrReviews) && swrReviews.length > 0
    ? swrReviews.map(r => ({
        quote: r.quote,
        author: r.authorName || r.author,
        role: r.authorRole || r.role || (r.company ? `Client at ${r.company}` : 'Verified Client'),
        initials: (r.authorName || r.author || 'CL').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        tech: r.badge || r.tech || 'Full-Stack'
      }))
    : defaultReviewsData;

  const allProjects = Array.isArray(swrProjects) && swrProjects.length > 0 ? swrProjects : initialSeedProjects;

  const filteredProjects = allProjects.filter(p => {
    if (activeFilter === 'all') return true;
    return (p.category || '').toLowerCase().includes(activeFilter.toLowerCase());
  }).slice(0, 6);

  // Typewriter effect
  useEffect(() => {
    let charIndex = textToType.length;
    let isDeleting = true;
    let timer = null;

    function type() {
      if (isDeleting) {
        setTypedText(textToType.substring(0, charIndex - 1));
        charIndex--;
        timer = setTimeout(type, 60);
      } else {
        setTypedText(textToType.substring(0, charIndex + 1));
        charIndex++;
        timer = setTimeout(type, 120);
      }

      if (!isDeleting && charIndex === textToType.length) {
        timer = setTimeout(() => {
          isDeleting = true;
          type();
        }, 5000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        timer = setTimeout(type, 400);
      }
    }

    timer = setTimeout(() => {
      isDeleting = true;
      type();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="page-home" className="page-view active">
      {/* SECTION 1: HERO (Synthesizing Hawra, Sammy, Flutter & Screenshot References) */}
      <section className="hero-section" style={{ padding: '20px 0 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Left Column: Portrait & Orbiting Tech Badges (from Sammy & Hawra references) */}
          <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div 
              style={{
                position: 'relative',
                width: '320px',
                height: '360px',
                backgroundColor: '#16100c',
                border: '1px solid rgba(223, 99, 38, 0.25)',
                borderRadius: '28px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
              }}
            >
              <img 
                src="/assets/muhammad-hasil.png" 
                alt="Muhammad Hasil" 
                style={{
                  width: '90%',
                  height: '92%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                  filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.8))'
                }}
              />

              {/* Status pill on portrait (from Hawra & Flutter references) */}
              <div 
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(18, 12, 8, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ffffff'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                AVAILABLE FOR PROJECTS
              </div>
            </div>

            {/* Orbiting Stack Badges (from Sammy reference) */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind'].map((tech, i) => (
                <span 
                  key={i} 
                  style={{
                    backgroundColor: '#1f1611',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f5efe9',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: '8px'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Floating Social Proof Card (from Sammy reference) */}
            <div 
              style={{
                marginTop: '16px',
                width: '320px',
                backgroundColor: '#18110c',
                border: '1px solid var(--border-card)',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#241913', border: '1.5px solid var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)', fontWeight: 800, fontSize: '13px' }}>
                99%
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>299+ Deliveries Worldwide</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column: Master Copy & Actions (from Hawra & Flutter references) */}
          <div style={{ flex: '1 1 520px', textAlign: 'left' }}>
            {/* Top Subtitle */}
            <div style={{ marginBottom: '14px' }}>
              <span 
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: 'var(--accent-orange)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}
              >
                FULL STACK DEVELOPER & UI/UX ARCHITECT
              </span>
            </div>

            {/* Master Headline */}
            <h1 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 4.6vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '18px'
              }}
            >
              Hi, I am <span style={{ color: 'var(--accent-orange)' }}>Muhammad.</span><br />
              Crafting Digital Systems that <span style={{ fontStyle: 'italic', fontWeight: 600 }}>Convert Visitors.</span>
            </h1>

            {/* Subtitle */}
            <p 
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '560px',
                marginBottom: '28px'
              }}
            >
              I bridge the gap between aesthetic brilliance and technical precision. Building fast, scalable, and high-converting web applications that scale your business.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <Link 
                href="/projects" 
                style={{
                  backgroundColor: 'var(--accent-orange)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '13px 28px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                View Portfolio <span>-&gt;</span>
              </Link>
              <Link 
                href="/contact" 
                style={{
                  backgroundColor: '#18110c',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '13px 24px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Contact Me
              </Link>
            </div>

            {/* Email link (from Hawra reference) */}
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Direct inquiry: <a href="mailto:esp.hasil.insight@gmail.com" style={{ color: 'var(--accent-orange)', textDecoration: 'none', fontWeight: 600 }}>esp.hasil.insight@gmail.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE EXPERIENCE MARQUEE (from screenshot reference) */}
      <section 
        className="marquee-section" 
        style={{
          backgroundColor: '#130c08',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 0',
          margin: '24px 0 48px'
        }}
      >
        <div className="marquee-track">
          <div className="marquee-content" style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.12em', color: '#ffffff' }}>
            <span>6+ YEARS EXPERIENCE</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>299+ DELIVERIES</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>99% POSITIVE REVIEWS</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>6+ YEARS EXPERIENCE</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>299+ DELIVERIES</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>99% POSITIVE REVIEWS</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
          </div>
          <div className="marquee-content" aria-hidden="true" style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.12em', color: '#ffffff' }}>
            <span>6+ YEARS EXPERIENCE</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>299+ DELIVERIES</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>99% POSITIVE REVIEWS</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>6+ YEARS EXPERIENCE</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>299+ DELIVERIES</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
            <span>99% POSITIVE REVIEWS</span> <span style={{ color: 'var(--accent-orange)', margin: '0 12px' }}>+</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT ME (from Flutter Reference: "Code is my medium. Empathy is my superpower.") */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 64px', padding: '0 16px' }}>
        <div 
          style={{
            backgroundColor: '#17110d',
            border: '1px solid var(--border-card)',
            borderRadius: '28px',
            padding: '40px',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px', backgroundColor: 'rgba(223, 99, 38, 0.12)', border: '1px solid rgba(223, 99, 38, 0.25)', padding: '4px 12px', borderRadius: '999px' }}>
            ABOUT ME
          </div>
          
          <h2 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#ffffff',
              marginBottom: '16px'
            }}
          >
            Code is my medium. <span style={{ color: 'var(--accent-orange)', fontStyle: 'italic' }}>Empathy is my superpower.</span>
          </h2>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '820px', marginBottom: '32px' }}>
            I am a full-stack developer with 6+ years of experience building pixel-perfect, high-performance web applications that solve real problems and create measurable business impact. From initial wireframes to robust MongoDB architecture, I engineer platforms designed to scale seamlessly.
          </p>

          {/* 3 Metric Counters (from Flutter reference) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '28px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>06+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Years Experience</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-orange)', fontFamily: 'var(--font-display)' }}>299+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Projects Delivered</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>200+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Happy Clients Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MY SKILLS & EXPERTISE (from Flutter Reference: "Expertise with Passion.") */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 72px', padding: '0 16px' }}>
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            MY SKILLS
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>
            Expertise with <span style={{ color: 'var(--accent-orange)', fontStyle: 'italic' }}>Passion.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px' }}>
            I combine creativity with technical excellence to build products that are fast, beautiful, and future-ready.
          </p>
        </div>

        {/* Bento Grid Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {/* Main Central Skill Card */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#1b130e', border: '1px solid rgba(223, 99, 38, 0.35)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-orange)' }}>PRIMARY STACK</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>95%</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>React.js & Next.js Architecture</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                SSR, dynamic routing, state hydration, SWR caching, and high-performance frontend engineering.
              </p>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', marginTop: '16px' }}>
              <div style={{ width: '95%', height: '100%', backgroundColor: 'var(--accent-orange)', borderRadius: '999px' }}></div>
            </div>
          </div>

          <div style={{ backgroundColor: '#16100c', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>BACKEND</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>88%</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Node.js & Express</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>REST APIs, authentication middleware, server-side store logic.</p>
          </div>

          <div style={{ backgroundColor: '#16100c', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>DATABASE</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>92%</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>MongoDB & PostgreSQL</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Mongoose schemas, indexing, ACID transactions, data persistence.</p>
          </div>

          <div style={{ backgroundColor: '#16100c', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>STYLING</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>96%</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Tailwind CSS & UI/UX</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Responsive math, WCAG compliance, fluid layout typography.</p>
          </div>

          <div style={{ backgroundColor: '#16100c', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>AUTOMATION</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>95%</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Discord API & Bots</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Community moderation, event automation, custom command handlers.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED WORK / SELECTED WORK THAT DELIVERS RESULTS (from screenshot & Flutter references) */}
      <section id="selected-work" style={{ maxWidth: '1200px', margin: '0 auto 72px', padding: '0 16px' }}>
        <ProjectGrid 
          initialProjects={initialProjects}
          limit={6}
          title="Digital experiences that make an impact."
          subtitle="Handcrafted full-stack platforms and web systems fetched directly from the MongoDB database."
        />

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link 
            href="/projects" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#18110c',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              padding: '12px 28px',
              borderRadius: '999px',
              textDecoration: 'none'
            }}
          >
            Explore All 11+ Projects <span>-&gt;</span>
          </Link>
        </div>
      </section>

      {/* SECTION 6: THE JOURNEY / CAREER MILESTONES (from Flutter reference: "The journey that shaped me.") */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 72px', padding: '0 16px' }}>
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            CAREER TIMELINE
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            The journey that <span style={{ color: 'var(--accent-orange)', fontStyle: 'italic' }}>shaped me.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#17110d', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '8px' }}>2016 - 2018</div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>WordPress Developer</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Freelance Operations</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>Completed 500+ private projects for multiple international clients.</p>
          </div>

          <div style={{ backgroundColor: '#17110d', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '8px' }}>2019 - 2021</div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Customer Support & Data Manager</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Quantum LHE</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>Managed Shopify store operations, product listings, orders, and customer fulfillment.</p>
          </div>

          <div style={{ backgroundColor: '#17110d', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '8px' }}>2024 - Present</div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Sales Engineer & B2B Leads</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Esp Inspire</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>Lead generation, data mining, automation pipelines, and prospect conversion.</p>
          </div>

          <div style={{ backgroundColor: '#17110d', border: '1px solid rgba(223, 99, 38, 0.35)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)', marginBottom: '8px' }}>2024 - Present</div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Lead Full Stack Developer</h4>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Freelance & Client Systems</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>Engineered full-stack portfolio systems, Next.js apps, REST APIs, and Discord bots.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: ATTENTION TO THE SMALLEST DETAILS (from screenshot reference) */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 72px', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            ENGINEERING CRAFT
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 12px' }}>
            I strive to pay attention to the <span style={{ color: 'var(--accent-orange)', fontStyle: 'italic' }}>smallest details.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            Every layout math rule, touch target, and database query is calibrated to deliver superior conversion and rock-solid stability.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '18px', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '12px' }}>01</div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Responsive & Mobile First</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Layouts designed for 1440px desktop baselines down to compact mobile displays with fluid scaling and zero overflow.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '18px', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '12px' }}>02</div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Sub-Second Performance</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Pre-rendered HTML with Next.js getServerSideProps, idle asset caching, and instantaneous client side hydration.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '18px', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '12px' }}>03</div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Scalable Architecture</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Clean React modular components, typed REST APIs, robust Zod validation schemas, and MongoDB persistence.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '18px', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '12px' }}>04</div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Conversion-Focused UX</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Strategic visual anchors and frictionless user funnels designed to turn casual site visitors into paying clients.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: CLIENT TESTIMONIALS SLIDER (Pulls from MongoDB) */}
      <section id="reviews" className="reviews-section-footer" style={{ maxWidth: '1100px', margin: '0 auto 64px', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            CLIENT FEEDBACK &amp; SOCIAL PROOF
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.8vw, 2.5rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            People <span style={{ color: 'var(--accent-orange)', fontStyle: 'italic' }}>love</span> working with me.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '580px', margin: '10px auto 0' }}>
            Verified client reviews pulled directly from the MongoDB database highlighting full-stack delivery, performance, and architecture.
          </p>
        </div>

        <TestimonialSlider initialReviews={reviewsList} />
      </section>

      {/* SECTION 9: CALL TO ACTION & DIRECT CONTACT FORM (EmailJS Integration) */}
      <section id="contact" style={{ maxWidth: '1100px', margin: '0 auto 64px', padding: '0 16px' }}>
        <div 
          style={{
            backgroundColor: '#1b130e',
            border: '1px solid rgba(223, 99, 38, 0.35)',
            borderRadius: '24px',
            padding: 'clamp(28px, 4vw, 44px)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              LET&apos;S WORK TOGETHER
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              Have a <span style={{ color: 'var(--accent-orange)', fontStyle: 'italic' }}>project</span> in mind?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '580px', margin: '0 auto 20px', lineHeight: '1.6' }}>
              Send an inquiry directly using EmailJS to esp.hasil.insight@gmail.com or explore freelance collaboration.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              <a 
                href="mailto:esp.hasil.insight@gmail.com" 
                style={{
                  backgroundColor: '#140e0a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '10px 22px',
                  borderRadius: '999px',
                  textDecoration: 'none'
                }}
              >
                Email Directly
              </a>
              <Link 
                href="/contact" 
                style={{
                  backgroundColor: 'var(--accent-orange)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '10px 22px',
                  borderRadius: '999px',
                  textDecoration: 'none'
                }}
              >
                Full Contact Page <span>-&gt;</span>
              </Link>
            </div>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <ContactForm title="Send a Direct Inquiry" />
          </div>
        </div>
      </section>

      {/* SECTION 10: NEWSLETTER SUBSCRIPTION FOR AUDIENCE & PROJECT UPDATES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 64px', padding: '0 16px' }}>
        <NewsletterSubscription />
      </section>

      {/* Global SWR validation bar */}
      <GlobalLoadingBar active={reviewsValidating || statsValidating} />
    </div>
  );
}

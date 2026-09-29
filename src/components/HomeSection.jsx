import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const reviewsData = [
  {
    quote: "Muhammad delivered our Next.js & React web application faster than expected with incredible attention to detail, clean full-stack code, and smooth 192-frame canvas animations.",
    author: "Sarah K.",
    role: "Digital Marketing Director",
    initials: "SK",
    tech: "Next.js & React"
  },
  {
    quote: "The interactive admin dashboard and MongoDB database persistence he built transformed how our client operations work. Highly recommended for any serious web project!",
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
    quote: "He transformed our brand UI with stunning dark glassmorphic design, smooth scroll physics, and fast Next.js Pages Router performance. Exceptional quality!",
    author: "Elena V.",
    role: "Creative Director",
    initials: "EV",
    tech: "UI/UX & Web Design"
  },
  {
    quote: "Flawless real-time data sync with Firestore and clean RESTful API integration. His expertise in full-stack architecture saved us weeks of development time.",
    author: "Marcus T.",
    role: "CTO at TechFlow",
    initials: "MT",
    tech: "Full-Stack Architecture"
  },
  {
    quote: "The digital product store and payment workflows he engineered were rock-solid. 100% persistent data even across hard reloads!",
    author: "Brandon P.",
    role: "Product Manager",
    initials: "BP",
    tech: "Next.js & API Routes"
  }
];

export default function HomeSection() {
  const [typedText, setTypedText] = useState('');
  const textToType = "MUHAMMAD HASIL";
  const [reviewsList, setReviewsList] = useState(reviewsData);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map(r => ({
            quote: r.quote,
            author: r.authorName,
            role: r.authorRole || (r.company ? `Client at ${r.company}` : 'Verified Client'),
            initials: (r.authorName || 'CL').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            tech: r.badge || 'Full-Stack'
          }));
          setReviewsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Typewriter effect
  useEffect(() => {
    let charIndex = 0;
    let isDeleting = false;
    let timer = null;

    function type() {
      if (isDeleting) {
        setTypedText(textToType.substring(0, charIndex - 1));
        charIndex--;
        timer = setTimeout(type, 55);
      } else {
        setTypedText(textToType.substring(0, charIndex + 1));
        charIndex++;
        timer = setTimeout(type, 125);
      }

      if (!isDeleting && charIndex === textToType.length) {
        timer = setTimeout(() => {
          isDeleting = true;
          type();
        }, 4500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        timer = setTimeout(type, 500);
      }
    }

    timer = setTimeout(type, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="page-home" className="page-view active">
      {/* Hero Section */}
      <section className="hero-section hero-front-title-layout">
        <div className="hero-title-front-layer">
          <span className="hero-tagline-badge">
            <span className="orange-dot"></span> FULL STACK DEVELOPER & UI/UX DESIGNER
          </span>
          <h1 className="hero-typo-graphic-title">
            <span id="typewriter-text" className="typewriter-target">{typedText}</span>
            <span className="typewriter-cursor">|</span>
          </h1>
          <div className="typo-sub-banner">
            <span>ENGINEERING</span> <span className="star">✦</span>
            <span>CREATIVE DESIGN</span> <span className="star">✦</span>
            <span>GAMING PLATFORMS</span>
          </div>
        </div>

        {/* Featured Portrait Cutout Layer */}
        <div className="hero-portrait-showcase-layer">
          <img src="/assets/muhammad-hasil.png" alt="Muhammad Hasil" className="hero-portrait-showcase-img" fetchpriority="high" />
        </div>

        {/* Hero Cards Container */}
        <div className="hero-cards-container">
          <div className="hero-card hero-card-left">
            <div className="card-tag">
              <span className="orange-dot"></span>
              <span>Trusted by 200+ clients</span>
            </div>
            <h2 className="card-heading">Websites that turn visitors into clients</h2>
            <div className="card-buttons">
              <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
                Start a Project <span className="arrow">↗</span>
              </Link>
              <Link href="/projects" className="btn-secondary" style={{ textDecoration: 'none' }}>
                View My Work <span className="arrow">↘</span>
              </Link>
            </div>
          </div>

          <div className="hero-card hero-card-right">
            <div className="avatars-row">
              <div className="avatar-circle">MH</div>
              <div className="avatar-circle">A1</div>
              <div className="avatar-circle">B2</div>
              <div className="avatar-circle">C3</div>
            </div>
            <p className="satisfaction-text">
              <strong>99.6%</strong> Of My Clients Are Satisfied — Be One Of Them Today.
            </p>
            <div className="social-links-pills">
              <a href="https://www.linkedin.com/in/muhammad-hasil/" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                LinkedIn ↗
              </a>
              <a href="https://www.patreon.com/MrVenomYT" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                Patreon ↗
              </a>
              <a href="https://pro.fiverr.com/users/venomdesigne613/" target="_blank" rel="noopener noreferrer" className="social-link-pill">
                Fiverr ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>6 YEARS EXPERIENCE</span> <span className="star">✦</span>
            <span>299+ DELIVERIES</span> <span className="star">✦</span>
            <span>99% POSITIVE REVIEWS</span> <span className="star">✦</span>
            <span>6 YEARS EXPERIENCE</span> <span className="star">✦</span>
            <span>299+ DELIVERIES</span> <span className="star">✦</span>
            <span>99% POSITIVE REVIEWS</span> <span className="star">✦</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>6 YEARS EXPERIENCE</span> <span className="star">✦</span>
            <span>299+ DELIVERIES</span> <span className="star">✦</span>
            <span>99% POSITIVE REVIEWS</span> <span className="star">✦</span>
            <span>6 YEARS EXPERIENCE</span> <span className="star">✦</span>
            <span>299+ DELIVERIES</span> <span className="star">✦</span>
            <span>99% POSITIVE REVIEWS</span> <span className="star">✦</span>
          </div>
        </div>
      </section>

      {/* Client Reviews Section - Auto Infinite Marquee Slider (No Buttons) */}
      <section id="reviews" className="reviews-section-footer">
        <div className="section-tag-center">
          <span className="orange-dot"></span>
          <span>CLIENT REVIEWS & TECH FEEDBACK</span>
        </div>
        <h2 className="reviews-title-center">What Clients Say About Working With Me</h2>

        <div className="reviews-marquee-container" style={{ overflow: "hidden", width: "100%", padding: "16px 0" }}>
          <div className="reviews-marquee-track">
            {[...reviewsList, ...reviewsList].map((rev, idx) => (
              <div 
                key={idx} 
                className="review-marquee-item"
                style={{
                  flex: "0 0 380px",
                  width: "380px",
                  minWidth: "380px",
                  maxWidth: "380px",
                  height: "270px",
                  minHeight: "270px",
                  maxHeight: "270px",
                  boxSizing: "border-box"
                }}
              >
                <div 
                  className="review-card-pro" 
                  style={{ 
                    backgroundColor: "rgba(20, 18, 16, 0.85)", 
                    backdropFilter: "blur(20px)", 
                    WebkitBackdropFilter: "blur(20px)", 
                    border: "1px solid rgba(255, 119, 0, 0.25)", 
                    borderRadius: "22px", 
                    padding: "24px 26px", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between", 
                    width: "380px",
                    minWidth: "380px",
                    maxWidth: "380px",
                    height: "270px",
                    minHeight: "270px",
                    maxHeight: "270px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ height: "135px", display: "flex", flexDirection: "column", justifyContent: "flex-start", overflow: "hidden" }}>
                    <div className="review-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", height: "24px", minHeight: "24px" }}>
                      <div className="stars-row" style={{ color: "#f59e0b", fontSize: "15px", letterSpacing: "2px" }}>★★★★★</div>
                      <span className="verified-badge" style={{ fontSize: "10px", color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 10px", borderRadius: "20px", fontWeight: "700" }}>
                        ✓ {rev.tech}
                      </span>
                    </div>
                    <p 
                      className="review-quote-text" 
                      style={{ 
                        fontSize: "14px", 
                        color: "#e2e8f0", 
                        lineHeight: "1.6", 
                        fontStyle: "italic", 
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        height: "90px",
                        maxHeight: "90px"
                      }}
                    >
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>

                  <div className="review-author-box" style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", height: "54px", minHeight: "54px", boxSizing: "border-box" }}>
                    <div className="author-avatar-initials" style={{ width: "38px", height: "38px", minWidth: "38px", borderRadius: "50%", backgroundColor: "rgba(249, 115, 22, 0.15)", border: "1.5px solid #ff7700", color: "#ff7700", fontWeight: "800", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {rev.initials}
                    </div>
                    <div className="author-info" style={{ overflow: "hidden" }}>
                      <strong className="author-name" style={{ color: "#ffffff", fontSize: "14px", fontWeight: "700", display: "block", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{rev.author}</strong>
                      <span className="author-role" style={{ fontSize: "12px", color: "#a1a1aa", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", display: "block" }}>{rev.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

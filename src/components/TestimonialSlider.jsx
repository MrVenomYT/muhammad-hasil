import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, CheckCircle2 } from 'lucide-react';
import { useReviews } from '../lib/usePortfolioData';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    authorName: 'James Allen',
    authorRole: 'Client & Founder',
    company: 'FinTech Platform',
    rating: 5,
    badge: 'Verified Client',
    quote: 'Hasil is highly skilled, creative, and dedicated to delivering exceptional work. His attention to detail, technical expertise, and ability to turn ideas into effective solutions truly stand out. It was a pleasure working with him, and I would confidently recommend Hasil for any development project.'
  },
  {
    id: 'rev-2',
    authorName: 'Brandon P.',
    authorRole: 'Product Manager',
    company: 'Elevate Apps',
    rating: 5,
    badge: 'Next.js & API Routes',
    quote: 'The digital product store and payment workflows he engineered were rock-solid. 100% persistent data even across hard reloads! Fast delivery and pristine code structure.'
  },
  {
    id: 'rev-3',
    authorName: 'Marcus T.',
    authorRole: 'CTO',
    company: 'TechFlow SaaS',
    rating: 5,
    badge: 'Full-Stack Architecture',
    quote: 'Flawless real-time data sync with Firestore and clean RESTful API integration. His expertise in full-stack architecture saved us weeks of development time.'
  },
  {
    id: 'rev-4',
    authorName: 'Elena V.',
    authorRole: 'Creative Director',
    company: 'Studio Lumina',
    rating: 5,
    badge: 'UI/UX & Web Design',
    quote: 'He transformed our brand UI with stunning dark aesthetics, smooth scroll physics, and fast Next.js performance. Exceptional quality and communication throughout.'
  },
  {
    id: 'rev-5',
    authorName: 'Sarah K.',
    authorRole: 'Digital Marketing Director',
    company: 'Nexus Growth',
    rating: 5,
    badge: 'Next.js & React',
    quote: 'Muhammad delivered our Next.js and React web application faster than expected with incredible attention to detail, clean full-stack code, and smooth animations.'
  },
  {
    id: 'rev-6',
    authorName: 'David M.',
    authorRole: 'SaaS Founder',
    company: 'V-Cloud Systems',
    rating: 5,
    badge: 'MongoDB & Cloud Architecture',
    quote: 'The interactive admin dashboard and database persistence he built transformed how our client operations work. Highly recommended for any serious web project.'
  }
];

export default function TestimonialSlider({ initialReviews = [] }) {
  const fallback = Array.isArray(initialReviews) && initialReviews.length > 0 
    ? initialReviews 
    : DEFAULT_REVIEWS;

  const { reviews: swrReviews } = useReviews(fallback);
  const reviewsList = Array.isArray(swrReviews) && swrReviews.length > 0 ? swrReviews : fallback;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const totalSlides = reviewsList.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay effect (6 seconds per slide, pauses on hover)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides, handleNext]);

  const currentReview = reviewsList[currentIndex] || reviewsList[0];
  const authorName = currentReview.authorName || currentReview.author || 'Verified Client';
  const authorRole = currentReview.authorRole || currentReview.role || 'Client';
  const company = currentReview.company ? ` at ${currentReview.company}` : '';
  const badge = currentReview.badge || 'Verified Client';
  const quote = currentReview.quote || '';
  const initials = authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div 
      className="testimonial-slider-wrapper"
      style={{
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Main Card */}
      <div
        style={{
          backgroundColor: '#18110c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: 'clamp(24px, 4vw, 44px)',
          position: 'relative',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Top Meta Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Star Rating & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
              5.0 / 5.0 Rating
            </span>
          </div>

          {/* Tag & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span 
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent-orange, #df6326)',
                backgroundColor: 'rgba(223, 99, 38, 0.12)',
                border: '1px solid rgba(223, 99, 38, 0.3)',
                padding: '4px 10px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {badge}
            </span>

            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Decorative Quote Icon */}
        <div style={{ position: 'absolute', top: '28px', right: '36px', opacity: 0.06, color: '#ffffff', pointerEvents: 'none' }}>
          <Quote size={80} />
        </div>

        {/* Testimonial Quote */}
        <blockquote style={{ margin: '0 0 32px 0', padding: 0 }}>
          <p 
            style={{
              fontSize: 'clamp(1.1rem, 2.3vw, 1.4rem)',
              lineHeight: 1.6,
              color: '#ffffff',
              fontStyle: 'italic',
              fontWeight: 400,
              margin: 0,
              minHeight: '80px'
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
        </blockquote>

        {/* Bottom Author Row & Navigation Controls */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          {/* Author Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#241913',
                border: '2px solid var(--accent-orange, #df6326)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                color: '#ffffff',
                flexShrink: 0
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff' }}>
                  {authorName}
                </span>
                <CheckCircle2 size={15} style={{ color: '#10b981' }} />
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                {authorRole}{company}
              </div>
            </div>
          </div>

          {/* Next / Prev Slider Arrow Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#120c08',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background-color 0.2s ease'
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--accent-orange, #df6326)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(223, 99, 38, 0.35)',
                transition: 'background-color 0.2s ease'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        {reviewsList.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: currentIndex === idx ? '28px' : '8px',
              height: '8px',
              borderRadius: '999px',
              backgroundColor: currentIndex === idx ? 'var(--accent-orange, #df6326)' : 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}

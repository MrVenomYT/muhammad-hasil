import React from 'react';

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="skeleton-card project-card-skeleton">
      <div className="skeleton-shimmer" style={{ width: '100%', height: '210px', borderRadius: '14px', marginBottom: '18px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '35%', height: '14px', borderRadius: '999px', marginBottom: '12px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '75%', height: '22px', borderRadius: '6px', marginBottom: '10px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '95%', height: '14px', borderRadius: '4px', marginBottom: '6px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '60%', height: '14px', borderRadius: '4px', marginBottom: '18px' }}></div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="skeleton-shimmer" style={{ width: '60px', height: '24px', borderRadius: '999px' }}></div>
        <div className="skeleton-shimmer" style={{ width: '70px', height: '24px', borderRadius: '999px' }}></div>
        <div className="skeleton-shimmer" style={{ width: '65px', height: '24px', borderRadius: '999px' }}></div>
      </div>
    </div>
  );
}

// Full Projects Grid Skeleton
export function ProjectsGridSkeleton({ count = 6 }) {
  return (
    <div className="projects-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <ProjectCardSkeleton key={idx} />
      ))}
    </div>
  );
}

// Info Card Skeleton (For Education, Experience, Certifications)
export function InfoCardSkeleton() {
  return (
    <div className="skeleton-card info-card-skeleton" style={{ minHeight: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="skeleton-shimmer" style={{ width: '42px', height: '42px', borderRadius: '12px' }}></div>
        <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', borderRadius: '999px' }}></div>
      </div>
      <div className="skeleton-shimmer" style={{ width: '80%', height: '20px', borderRadius: '6px', marginBottom: '10px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '50%', height: '14px', borderRadius: '4px', marginBottom: '14px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '100%', height: '13px', borderRadius: '4px', marginBottom: '6px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '85%', height: '13px', borderRadius: '4px' }}></div>
    </div>
  );
}

// Full Info Grid Skeleton
export function InfoGridSkeleton({ count = 3 }) {
  return (
    <div className="info-cards-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <InfoCardSkeleton key={idx} />
      ))}
    </div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card product-card-skeleton">
      <div className="skeleton-shimmer" style={{ width: '100%', height: '190px', borderRadius: '14px', marginBottom: '16px' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div className="skeleton-shimmer" style={{ width: '30%', height: '14px', borderRadius: '999px' }}></div>
        <div className="skeleton-shimmer" style={{ width: '20%', height: '18px', borderRadius: '6px' }}></div>
      </div>
      <div className="skeleton-shimmer" style={{ width: '70%', height: '20px', borderRadius: '6px', marginBottom: '10px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '90%', height: '14px', borderRadius: '4px', marginBottom: '16px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '100%', height: '40px', borderRadius: '10px' }}></div>
    </div>
  );
}

// Top Global Loading Indicator (Subtle Glowing Bar)
export function GlobalLoadingBar({ active = false }) {
  if (!active) return null;
  return (
    <div className="global-swr-indicator" title="Syncing real-time updates...">
      <div className="swr-spinner-dot"></div>
      <span>Syncing...</span>
    </div>
  );
}

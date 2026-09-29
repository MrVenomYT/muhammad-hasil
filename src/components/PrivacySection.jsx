import React from 'react';
import Link from 'next/link';

export default function PrivacySection() {
  return (
    <div id="page-privacy" className="page-view active" style={{ paddingBottom: '90px' }}>
      <section className="about-section" style={{ maxWidth: '860px' }}>
        <div className="section-tag">
          <span className="orange-dot"></span>
          <span>LEGAL & COMPLIANCE</span>
        </div>
        <h2 className="section-title">Privacy Policy</h2>
        <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '0 0 28px 0' }}>
          Last updated: September 2026 · Effective immediately
        </p>

        <div style={{
          backgroundColor: 'rgba(18, 16, 14, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '32px',
          color: '#d1d5db',
          fontSize: '14px',
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>1. Information We Collect</h3>
            <p style={{ margin: 0 }}>
              When you submit an inquiry through our contact form, we collect your name, email address, inquiry subject, and message details. We do not sell, rent, or trade your personal information with any third parties.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>2. How Information Is Stored & Used</h3>
            <p style={{ margin: 0 }}>
              Information submitted is used solely to respond to project proposals, communicate delivery milestones, and issue invoice receipts. All data is securely handled via encrypted database storage.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>3. Digital Product Purchases & Licensing</h3>
            <p style={{ margin: 0 }}>
              Payment and transaction processing for digital products and custom freelance orders is handled securely via accredited platforms such as Fiverr Pro and Stripe. No payment card numbers are stored directly on our servers.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>4. Cookies & Analytics</h3>
            <p style={{ margin: 0 }}>
              Our site uses minimal session storage for theme preferences and fast cached navigation. We do not engage in aggressive cross-site tracking or third-party advertising cookies.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>5. Contact & Data Requests</h3>
            <p style={{ margin: 0 }}>
              If you have any questions regarding your information or would like your contact history removed from our records, please contact Muhammad Hasil at <a href="mailto:esp.hasil.insight@gmail.com" style={{ color: '#ff7700' }}>esp.hasil.insight@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

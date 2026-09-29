import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FaqSection() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFaqs(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category || 'General')))];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div id="page-faq" className="page-view active" style={{ paddingBottom: '90px' }}>
      <section className="about-section">
        <div className="section-tag">
          <span className="orange-dot"></span>
          <span>HELP & CLIENT FAQ</span>
        </div>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p style={{ color: '#a1a1aa', maxWidth: '640px', margin: '0 0 28px 0', fontSize: '15px', lineHeight: 1.6 }}>
          Everything you need to know about engineering capabilities, pricing, commercial licensing, turnaround times, and deployment.
        </p>

        {/* Categories Filter */}
        {categories.length > 2 && (
          <div className="projects-tabs-row" style={{ marginBottom: '28px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`project-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '820px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || faq._id || idx}
                style={{
                  backgroundColor: isOpen ? 'rgba(24, 21, 18, 0.95)' : 'rgba(18, 16, 14, 0.75)',
                  border: isOpen ? '1px solid rgba(255, 119, 0, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ffffff',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.2px' }}>
                    {faq.question}
                  </span>
                  <span style={{
                    color: isOpen ? '#ff7700' : '#94a3b8',
                    fontSize: '18px',
                    fontWeight: 700,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block'
                  }}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 22px 20px 22px', color: '#cbd5e1', fontSize: '14px', lineHeight: 1.65 }}>
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inquire CTA block */}
        <div style={{
          marginTop: '48px',
          padding: '24px 28px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 119, 0, 0.08)',
          border: '1px solid rgba(255, 119, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          maxWidth: '820px'
        }}>
          <div>
            <strong style={{ color: '#ffffff', fontSize: '15px', display: 'block' }}>Have a question not listed here?</strong>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Reach out directly through the contact section or Fiverr Pro.</span>
          </div>
          <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
            Send an Inquiry ↗
          </Link>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { contactFormSchema } from '../lib/validations';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform strict Zod schema validation
    const parseResult = contactFormSchema.safeParse(formData);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(err => err.message).join('. ');
      setStatus({ type: 'error', text: `❌ ${errorMsg}` });
      return;
    }

    const validated = parseResult.data;
    const serviceID = process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    setSending(true);
    setStatus({ type: 'info', text: 'Sending your inquiry to esp.hasil.insight@gmail.com...' });

    try {
      // 1. Store permanently in MongoDB via API
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: validated.from_name,
          email: validated.from_email,
          subject: validated.subject,
          message: validated.message,
          serviceType: 'Full-Stack Web App Development',
        })
      });

      const apiJson = await res.json();
      if (!apiJson.success) {
        throw new Error(apiJson.error || 'Server validation failed');
      }

      // 2. Also send via EmailJS
      if (serviceID && templateID && publicKey) {
        await emailjs.send(serviceID, templateID, validated, publicKey).catch((e) => console.warn('EmailJS note:', e));
      }

      setStatus({ type: 'success', text: '✓ Thank you! Your inquiry has been sent to esp.hasil.insight@gmail.com and permanently logged.' });
      setFormData({ from_name: '', from_email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Inquiry Submission Error:', err);
      setStatus({ type: 'error', text: `❌ ${err.message || 'Unable to send inquiry right now. Please reach out directly at esp.hasil.insight@gmail.com or on Fiverr.'}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="page-contact" className="page-view active" style={{ padding: '20px 0 80px 0' }}>
      <section className="contact-section" style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 0' }}>
        {/* Header Section */}
        <motion.div 
          className="contact-header-center" 
          style={{ textAlign: 'center', marginBottom: '36px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#ff7700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            LET'S WORK TOGETHER
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0'
          }}>
            Have a <span style={{ color: '#ff7700', fontStyle: 'italic' }}>project</span> in mind?
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#e4e4e7',
            opacity: 0.9,
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            lineHeight: 1.6
          }}>
            Send an inquiry directly using EmailJS to <strong style={{ color: '#ffffff' }}>esp.hasil.insight@gmail.com</strong> or explore freelance collaboration.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              href="mailto:esp.hasil.insight@gmail.com" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px 26px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Email Directly</span>
            </a>

            <a 
              href="https://pro.fiverr.com/users/venomdesigne613/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ff7700',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(255, 119, 0, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Hire on Fiverr Pro</span>
              <span>→</span>
            </a>
          </div>
        </motion.div>

        {/* Direct Inquiry Form Card */}
        <motion.div 
          style={{
            backgroundColor: 'rgba(16, 14, 12, 0.82)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '40px 36px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 119, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em'
            }}>
              Send a Direct Inquiry
            </h2>
            <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
              Direct message sent to business email <strong style={{ color: '#ff7700' }}>esp.hasil.insight@gmail.com</strong> and permanently logged.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 2-Column Row for Name & Email */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px'
            }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="from_name" style={{ fontSize: '13px', fontWeight: 700, color: '#e4e4e7', textTransform: 'none' }}>
                  Your Name <span style={{ color: '#ff7700' }}>*</span>
                </label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  required
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '12px',
                    padding: '13px 16px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="from_email" style={{ fontSize: '13px', fontWeight: 700, color: '#e4e4e7', textTransform: 'none' }}>
                  Your Email <span style={{ color: '#ff7700' }}>*</span>
                </label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  value={formData.from_email}
                  onChange={handleChange}
                  placeholder="e.g. alex@company.com"
                  required
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '12px',
                    padding: '13px 16px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="subject" style={{ fontSize: '13px', fontWeight: 700, color: '#e4e4e7', textTransform: 'none' }}>
                Subject <span style={{ color: '#ff7700' }}>*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Web Development Inquiry"
                required
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Message Textarea */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="message" style={{ fontSize: '13px', fontWeight: 700, color: '#e4e4e7', textTransform: 'none' }}>
                Message <span style={{ color: '#ff7700' }}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your project, timeline, deliverables, and goals..."
                rows="5"
                required
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '120px',
                  lineHeight: '1.6'
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ff7700',
                  color: '#ffffff',
                  border: 'none',
                  padding: '13px 32px',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(255, 119, 0, 0.4)',
                  transition: 'all 0.2s ease',
                  opacity: sending ? 0.7 : 1
                }}
              >
                <span>{sending ? 'Sending Message...' : 'Send Inquiry'}</span>
                <span>→</span>
              </button>
            </div>

            {/* Status Alert Banner */}
            {status.text && (
              <div 
                className={`contact-status-msg ${status.type}`} 
                style={{ 
                  display: 'block', 
                  marginTop: '16px',
                  backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  borderColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)',
                  color: status.type === 'error' ? '#fca5a5' : '#10b981'
                }}
              >
                {status.text}
              </div>
            )}
          </form>
        </motion.div>

        {/* Quick Social Connect Channels */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: '44px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>Other Ways to Connect:</span>
          
          <a 
            href="https://pro.fiverr.com/users/venomdesigne613/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link-pill"
          >
            Fiverr Pro ↗
          </a>

          <a 
            href="https://www.linkedin.com/in/muhammad-hasil/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link-pill"
          >
            LinkedIn ↗
          </a>

          <a 
            href="https://www.patreon.com/MrVenomYT" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link-pill"
          >
            Patreon ↗
          </a>
        </div>
      </section>

      <section className="closing-section" style={{ padding: '50px 0 20px 0' }}>
        <h2 className="closing-quote" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', opacity: 0.85 }}>
          I strive to pay attention to the smallest details
        </h2>
      </section>
    </div>
  );
}

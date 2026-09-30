import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
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

    // Perform strict Zod schema validation for email format and message length
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
    setStatus({ type: 'info', text: 'Sending your inquiry...' });

    try {
      // 1. Store permanently in MongoDB via API with validated schema
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

      // 2. Also send via EmailJS if configured
      if (serviceID && templateID && publicKey) {
        await emailjs.send(serviceID, templateID, validated, publicKey).catch((e) => console.warn('EmailJS note:', e));
      }

      setStatus({ type: 'success', text: '✓ Thank you! Your message has been validated and sent to Muhammad Hasil.' });
      setFormData({ from_name: '', from_email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Inquiry Submission Error:', err);
      setStatus({ type: 'error', text: `❌ ${err.message || 'Unable to send inquiry right now. Please reach out directly on LinkedIn or Fiverr.'}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="page-contact" className="page-view active">
      <section className="contact-section">
        <div className="section-tag">
          <span className="orange-dot"></span>
          <span>GET IN TOUCH</span>
        </div>
        <h2 className="section-title">Let's Build Something Great Together</h2>

        <div className="contact-container-grid">
          <div className="contact-info-box">
            <h3 className="contact-box-title">Have a project in mind?</h3>
            <p className="contact-box-desc">I am available for freelance work, custom web projects, Patreon membership support, and full-stack engineering roles.</p>
            <div className="contact-links-stack">
              <a href="https://pro.fiverr.com/users/venomdesigne613/" target="_blank" rel="noopener noreferrer" className="contact-social-btn btn-fiverr">
                <span className="btn-label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  Hire me
                </span>
                <span className="arrow">↗</span>
              </a>
              <a href="https://www.linkedin.com/in/muhammad-hasil/" target="_blank" rel="noopener noreferrer" className="contact-social-btn btn-linkedin">
                <span className="btn-label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                  </svg>
                  Connect on LinkedIn
                </span>
                <span className="arrow">↗</span>
              </a>
              <a href="https://www.patreon.com/MrVenomYT" target="_blank" rel="noopener noreferrer" className="contact-social-btn btn-patreon">
                <span className="btn-label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 .5v23h4.12v-23zm15.38 0a8.62 8.62 0 1 0 8.62 8.62 8.62 0 0 0-8.62-8.62z" />
                  </svg>
                  Support on Patreon
                </span>
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="from_name">Your Name</label>
              <input 
                type="text" 
                id="from_name" 
                name="from_name" 
                value={formData.from_name} 
                onChange={handleChange} 
                placeholder="John Doe" 
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label htmlFor="from_email">Your Email</label>
              <input 
                type="email" 
                id="from_email" 
                name="from_email" 
                value={formData.from_email} 
                onChange={handleChange} 
                placeholder="john@example.com" 
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="Project Inquiry / Job Opportunity" 
                required 
                className="form-input" 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Tell me about your project..." 
                rows="4" 
                required 
                className="form-input" 
              />
            </div>
            <button type="submit" disabled={sending} className="btn-primary btn-submit">
              <span className="btn-submit-text">{sending ? 'Sending...' : 'Send Message'}</span> <span className="arrow">↗</span>
            </button>

            {status.text && (
              <div className={`contact-status-msg ${status.type}`} style={{ marginTop: '15px' }}>
                {status.text}
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="closing-section">
        <h2 className="closing-quote">I strive to pay attention to the smallest details</h2>
      </section>
    </div>
  );
}

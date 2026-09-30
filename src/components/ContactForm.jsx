import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { contactFormSchema } from '../lib/validations';
import { useToast } from '../context/ToastContext';

export default function ContactForm({ title = "Send an Inquiry", onSuccess, className = "" }) {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatus({ type: '', text: '' });

    // Validate with Zod schema
    const parseResult = contactFormSchema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors = {};
      parseResult.error.errors.forEach(err => {
        const field = err.path[0];
        if (field) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      setStatus({ type: 'error', text: 'Please correct the highlighted errors before submitting.' });
      return;
    }

    const validated = parseResult.data;
    setSending(true);
    setStatus({ type: 'info', text: 'Transmitting inquiry to business inbox...' });

    // Client-side EmailJS environment variables (if exposed)
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;

    try {
      // 1. Post to backend API which stores in MongoDB AND dispatches to EmailJS REST API
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: validated.from_name,
          email: validated.from_email,
          subject: validated.subject,
          message: validated.message,
          serviceType: 'Full-Stack Development Inquiry'
        })
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Server validation failed.');
      }

      // 2. Client-side EmailJS call if keys are present on client
      if (serviceID && templateID && publicKey) {
        try {
          await emailjs.send(
            serviceID,
            templateID,
            {
              from_name: validated.from_name,
              from_email: validated.from_email,
              reply_to: validated.from_email,
              to_email: 'esp.hasil.insight@gmail.com',
              subject: validated.subject,
              message: validated.message
            },
            publicKey
          );
        } catch (clientMailErr) {
          console.warn('Client EmailJS notification note:', clientMailErr);
        }
      }

      setStatus({
        type: 'success',
        text: 'Thank you. Your inquiry has been sent to Muhammad Hasil (esp.hasil.insight@gmail.com).'
      });
      showSuccess('Your inquiry has been sent to Muhammad Hasil (esp.hasil.insight@gmail.com).', 'Inquiry Delivered');
      setFormData({
        from_name: '',
        from_email: '',
        subject: '',
        message: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Contact form error:', err);
      const errMsg = err.message || 'Unable to submit your message. Please reach out directly on LinkedIn or Fiverr.';
      setStatus({
        type: 'error',
        text: errMsg
      });
      showError(errMsg, 'Delivery Failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div 
      className={`contact-form-component ${className}`}
      style={{
        backgroundColor: '#18110c',
        border: '1px solid var(--border-card)',
        borderRadius: '24px',
        padding: '36px',
        textAlign: 'left'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Direct message sent to business email <span style={{ color: 'var(--accent-orange)' }}>esp.hasil.insight@gmail.com</span> and permanently logged.
        </p>
      </div>

      {status.text && (
        <div 
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
            backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : status.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(223, 99, 38, 0.12)',
            border: `1px solid ${status.type === 'error' ? '#ef4444' : status.type === 'success' ? '#22c55e' : 'var(--accent-orange)'}`,
            color: status.type === 'error' ? '#fca5a5' : status.type === 'success' ? '#86efac' : '#fed7aa'
          }}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Your Name <span style={{ color: 'var(--accent-orange)' }}>*</span>
            </label>
            <input 
              type="text"
              name="from_name"
              placeholder="e.g. Alex Morgan"
              value={formData.from_name}
              onChange={handleChange}
              disabled={sending}
              style={{
                width: '100%',
                backgroundColor: '#130c08',
                border: `1px solid ${errors.from_name ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.from_name && (
              <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                {errors.from_name}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Your Email <span style={{ color: 'var(--accent-orange)' }}>*</span>
            </label>
            <input 
              type="email"
              name="from_email"
              placeholder="e.g. alex@company.com"
              value={formData.from_email}
              onChange={handleChange}
              disabled={sending}
              style={{
                width: '100%',
                backgroundColor: '#130c08',
                border: `1px solid ${errors.from_email ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.from_email && (
              <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                {errors.from_email}
              </span>
            )}
          </div>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            Subject <span style={{ color: 'var(--accent-orange)' }}>*</span>
          </label>
          <input 
            type="text"
            name="subject"
            placeholder="e.g. Full-Stack Web Development Inquiry"
            value={formData.subject}
            onChange={handleChange}
            disabled={sending}
            style={{
              width: '100%',
              backgroundColor: '#130c08',
              border: `1px solid ${errors.subject ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#ffffff',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.subject && (
            <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
              {errors.subject}
            </span>
          )}
        </div>

        {/* Message */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            Message <span style={{ color: 'var(--accent-orange)' }}>*</span>
          </label>
          <textarea 
            name="message"
            rows="5"
            placeholder="Describe your project, timeline, deliverables, and goals..."
            value={formData.message}
            onChange={handleChange}
            disabled={sending}
            style={{
              width: '100%',
              backgroundColor: '#130c08',
              border: `1px solid ${errors.message ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '10px',
              padding: '14px 16px',
              fontSize: '14px',
              color: '#ffffff',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          {errors.message && (
            <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
              {errors.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={sending}
          style={{
            backgroundColor: sending ? '#9e4618' : 'var(--accent-orange)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 32px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: sending ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s ease, transform 0.2s ease'
          }}
        >
          {sending ? (
            <>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
              Sending Message...
            </>
          ) : (
            <>
              Send Inquiry <span>-&gt;</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

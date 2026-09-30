import { saveSubscriber } from '../../../lib/server-store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { email, source = 'portfolio_newsletter' } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const result = await saveSubscriber(email.trim(), source);

    if (!result.isNew) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to project updates and engineering releases!',
        subscriber: result.subscriber
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! You will receive future project updates and release notes.',
      subscriber: result.subscriber
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again later.' });
  }
}

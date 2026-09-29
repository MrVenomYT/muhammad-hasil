import { getFaqs, saveFaq } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const faqs = await getFaqs();
        return res.status(200).json({ success: true, data: faqs });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        if (!req.body || !req.body.question || !req.body.answer) {
          return res.status(400).json({ success: false, error: 'Question and answer are required.' });
        }
        const saved = await saveFaq(req.body);
        return res.status(201).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

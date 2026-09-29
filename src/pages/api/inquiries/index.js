import { getInquiries, saveInquiry } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const inquiries = await getInquiries();
        return res.status(200).json({ success: true, data: inquiries });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
          return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
        }
        const saved = await saveInquiry(req.body);
        return res.status(201).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

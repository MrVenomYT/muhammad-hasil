import { getReviews, saveReview } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const reviews = await getReviews();
        return res.status(200).json({ success: true, data: reviews });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        if (!req.body || !req.body.authorName || !req.body.quote) {
          return res.status(400).json({ success: false, error: 'Author name and quote are required.' });
        }
        const saved = await saveReview(req.body);
        return res.status(201).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

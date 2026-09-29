import { getInquiries, saveInquiry, deleteInquiry } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case 'GET':
      try {
        const inquiries = await getInquiries();
        const found = inquiries.find(i => i.id === id || i._id === id);
        if (!found) {
          return res.status(404).json({ success: false, error: 'Inquiry not found' });
        }
        return res.status(200).json({ success: true, data: found });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'PUT':
      try {
        const saved = await saveInquiry({ ...req.body, id });
        return res.status(200).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'DELETE':
      try {
        await deleteInquiry(id);
        return res.status(200).json({ success: true, message: 'Inquiry deleted' });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

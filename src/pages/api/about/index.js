import { getAbout, saveAbout } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const aboutData = await getAbout();
        return res.status(200).json({ success: true, data: aboutData });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'PUT':
    case 'POST':
      try {
        const saved = await saveAbout(req.body);
        return res.status(200).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

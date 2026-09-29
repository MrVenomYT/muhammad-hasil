import { getProfile, saveProfile } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const profile = await getProfile();
        return res.status(200).json({ success: true, data: profile });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'PUT':
    case 'POST':
      try {
        const saved = await saveProfile(req.body);
        return res.status(200).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

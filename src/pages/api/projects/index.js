import { getProjects, saveProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const projects = await getProjects();
        return res.status(200).json({ success: true, data: projects });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        const parseResult = projectSchema.safeParse(req.body);
        if (!parseResult.success) {
          const errorMessage = parseResult.error.errors.map(err => err.message).join(', ');
          return res.status(400).json({ success: false, error: errorMessage });
        }
        const validatedData = parseResult.data;
        const saved = await saveProject(validatedData);
        return res.status(201).json({ success: true, data: saved });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

import { getProjects, saveProject } from '../../../lib/server-store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { id, type = 'click' } = req.body || req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Project ID is required' });
    }

    const projects = await getProjects();
    const project = projects.find(p => p.id === id || p._id === id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const currentClicks = typeof project.clicks === 'number' ? project.clicks : 0;
    const currentViews = typeof project.views === 'number' ? project.views : 0;

    const updatedProject = {
      ...project,
      clicks: type === 'click' ? currentClicks + 1 : currentClicks,
      views: type === 'view' ? currentViews + 1 : currentViews,
      updatedAt: new Date().toISOString()
    };

    const saved = await saveProject(updatedProject);
    return res.status(200).json({
      success: true,
      data: {
        id: saved.id || saved._id,
        views: saved.views,
        clicks: saved.clicks,
        ctr: saved.views > 0 ? parseFloat(((saved.clicks / saved.views) * 100).toFixed(1)) : 0
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

import { getProjects, saveProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';

export default async function handler(req, res) {
  const { method } = req;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/projects] [${method}] Request received from ${clientIp}`);

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/projects] [GET] Fetching all projects...`);
        const projects = await getProjects();
        console.log(`[${timestamp}] [API /api/projects] [GET] Successfully retrieved ${projects?.length || 0} projects.`);
        return res.status(200).json({ 
          success: true, 
          count: projects?.length || 0,
          data: projects 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects] [GET] Error fetching projects:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to fetch projects from server' 
        });
      }

    case 'POST':
      try {
        console.log(`[${timestamp}] [API /api/projects] [POST] Project creation payload received:`, {
          title: req.body?.title,
          category: req.body?.category,
          technologiesCount: Array.isArray(req.body?.technologies) ? req.body.technologies.length : typeof req.body?.technologies,
          hasLiveDemo: Boolean(req.body?.liveDemoUrl),
          hasGithub: Boolean(req.body?.githubUrl)
        });

        if (!req.body || typeof req.body !== 'object') {
          console.warn(`[${timestamp}] [API /api/projects] [POST] 400 Bad Request: Empty or invalid body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a valid JSON object' 
          });
        }

        const parseResult = projectSchema.safeParse(req.body);
        if (!parseResult.success) {
          const formattedErrors = parseResult.error.errors.map(err => `${err.path.join('.') || 'field'}: ${err.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/projects] [POST] 400 Validation failed: ${formattedErrors}`);
          return res.status(400).json({ 
            success: false, 
            error: formattedErrors,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        console.log(`[${timestamp}] [API /api/projects] [POST] Validated successfully. Saving project "${validatedData.title}"...`);
        
        const saved = await saveProject(validatedData);
        if (!saved || (!saved.id && !saved._id)) {
          console.error(`[${timestamp}] [API /api/projects] [POST] 500 Save failed: Store returned invalid result`, saved);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to persist project in database store' 
          });
        }

        console.log(`[${timestamp}] [API /api/projects] [POST] 201 Created: Project successfully saved with ID "${saved.id || saved._id}"`);
        return res.status(201).json({ 
          success: true, 
          message: 'Project created successfully', 
          data: saved 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects] [POST] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while saving project' 
        });
      }

    default:
      console.warn(`[${timestamp}] [API /api/projects] [${method}] 405 Method Not Allowed`);
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${method} Not Allowed. Supported methods: GET, POST.` 
      });
  }
}

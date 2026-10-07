import { getProjects, saveProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';

export default async function handler(req, res) {
  const { method } = req;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/projects] [${method}] Incoming request from IP: ${clientIp}`);

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/projects] [GET] Querying all projects from server store...`);
        const projects = await getProjects();
        console.log(`[${timestamp}] [API /api/projects] [GET] Found ${projects?.length || 0} project records.`);
        return res.status(200).json({ 
          success: true, 
          count: projects?.length || 0,
          data: projects 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects] [GET] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to fetch projects from server' 
        });
      }

    case 'POST':
      try {
        console.log(`[${timestamp}] [API /api/projects] [POST] Project creation started.`);
        console.log(`[${timestamp}] [API /api/projects] [POST] Raw payload:`, {
          title: req.body?.title,
          category: req.body?.category,
          pill: req.body?.pill,
          featured: req.body?.featured,
          technologies: req.body?.technologies,
          liveDemoUrl: req.body?.liveDemoUrl,
          githubUrl: req.body?.githubUrl,
          imageUrl: req.body?.imageUrl
        });

        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
          console.warn(`[${timestamp}] [API /api/projects] [POST] 400 Bad Request: Missing or empty request body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a non-empty JSON object with project details.' 
          });
        }

        const parseResult = projectSchema.safeParse(req.body);
        if (!parseResult.success) {
          const validationIssues = parseResult.error.errors.map(err => ({
            field: err.path.join('.') || 'root',
            message: err.message
          }));
          const formattedSummary = validationIssues.map(i => `${i.field}: ${i.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/projects] [POST] 400 Validation Failed: ${formattedSummary}`, validationIssues);
          return res.status(400).json({ 
            success: false, 
            error: `Validation error: ${formattedSummary}`,
            validationErrors: validationIssues,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        console.log(`[${timestamp}] [API /api/projects] [POST] Payload validated successfully for project: "${validatedData.title}". Writing to database & storage...`);
        
        const startTime = Date.now();
        const savedProject = await saveProject(validatedData);
        const durationMs = Date.now() - startTime;

        if (!savedProject || (!savedProject.id && !savedProject._id)) {
          console.error(`[${timestamp}] [API /api/projects] [POST] 500 Save failed: Store returned invalid result object`, savedProject);
          return res.status(500).json({ 
            success: false, 
            error: 'Database persistence failed: Unable to save project record.' 
          });
        }

        console.log(`[${timestamp}] [API /api/projects] [POST] 201 Created: Project "${savedProject.title}" persisted successfully in ${durationMs}ms with ID: ${savedProject.id || savedProject._id}`);
        return res.status(201).json({ 
          success: true, 
          message: 'Project created successfully', 
          data: savedProject 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects] [POST] 500 Unexpected Internal Error:`, {
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while processing project creation request' 
        });
      }

    default:
      console.warn(`[${timestamp}] [API /api/projects] [${method}] 405 Method Not Allowed`);
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ 
        success: false, 
        error: `HTTP Method ${method} Not Allowed. Supported methods: GET, POST.` 
      });
  }
}


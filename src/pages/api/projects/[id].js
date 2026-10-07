import { getProjects, saveProject, deleteProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/projects/${id || 'unknown'}] [${method}] Request received from IP: ${clientIp}`);

  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn(`[${timestamp}] [API /api/projects/[id]] [${method}] 400 Bad Request: Missing or empty project id parameter.`);
    return res.status(400).json({ 
      success: false, 
      error: 'Project ID parameter is required in the URL route.' 
    });
  }

  const strId = String(id).trim();

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/projects/${strId}] [GET] Querying project by identifier...`);
        const projects = await getProjects();
        const found = projects.find(p => String(p.id || '').trim() === strId || String(p._id || '').trim() === strId);
        
        if (!found) {
          console.warn(`[${timestamp}] [API /api/projects/${strId}] [GET] 404 Not Found: No matching project.`);
          return res.status(404).json({ 
            success: false, 
            error: `Project with ID "${strId}" was not found in storage or database` 
          });
        }

        console.log(`[${timestamp}] [API /api/projects/${strId}] [GET] 200 OK: Retrieved project "${found.title}"`);
        return res.status(200).json({ 
          success: true, 
          data: found 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects/${strId}] [GET] 500 Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to retrieve project record' 
        });
      }

    case 'PUT':
      try {
        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] Project update payload received:`, {
          title: req.body?.title,
          category: req.body?.category,
          technologies: req.body?.technologies
        });

        if (!req.body || typeof req.body !== 'object') {
          console.warn(`[${timestamp}] [API /api/projects/${strId}] [PUT] 400 Bad Request: Empty body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a valid JSON object with updated project fields.' 
          });
        }

        const parseResult = projectSchema.safeParse({ ...req.body, id: strId });
        if (!parseResult.success) {
          const formattedErrors = parseResult.error.errors.map(err => `${err.path.join('.') || 'field'}: ${err.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/projects/${strId}] [PUT] 400 Validation failed: ${formattedErrors}`);
          return res.status(400).json({ 
            success: false, 
            error: `Validation error: ${formattedErrors}`,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] Validated successfully. Updating project "${validatedData.title}"...`);

        const saved = await saveProject(validatedData);
        if (!saved) {
          console.error(`[${timestamp}] [API /api/projects/${strId}] [PUT] 500 Update returned null.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to update project in store' 
          });
        }

        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] 200 OK: Project successfully updated.`);
        return res.status(200).json({ 
          success: true, 
          message: 'Project updated successfully', 
          data: saved 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects/${strId}] [PUT] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while updating project' 
        });
      }

    case 'DELETE':
      try {
        console.log(`[${timestamp}] [API /api/projects/${strId}] [DELETE] Initiating deletion of project with ID: "${strId}"...`);
        const startTime = Date.now();
        
        const deleteResult = await deleteProject(strId);
        const durationMs = Date.now() - startTime;
        
        console.log(`[${timestamp}] [API /api/projects/${strId}] [DELETE] 200 OK: Deletion completed in ${durationMs}ms:`, {
          id: strId,
          removedFromDisk: deleteResult.removedFromDisk,
          mongoDeletedCount: deleteResult.mongoDeletedCount
        });

        return res.status(200).json({ 
          success: true, 
          message: `Project "${strId}" permanently deleted from MongoDB and storage`,
          id: strId,
          details: {
            removedFromDisk: deleteResult.removedFromDisk,
            mongoDeletedCount: deleteResult.mongoDeletedCount,
            durationMs
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects/${strId}] [DELETE] 500 Internal Server Error:`, {
          id: strId,
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while deleting project from database/storage' 
        });
      }

    default:
      console.warn(`[${timestamp}] [API /api/projects/${strId}] [${method}] 405 Method Not Allowed`);
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false, 
        error: `HTTP Method ${method} Not Allowed. Supported methods: GET, PUT, DELETE.` 
      });
  }
}


import { getProjects, saveProject, deleteProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';
import { db } from '../../../../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

/**
 * Persists an updated project document to Firestore with strict error trapping
 */
async function syncProjectUpdateToFirestore(id, projectData) {
  if (!db) {
    return { synced: false, reason: 'Firestore DB not initialized or offline' };
  }
  try {
    const docId = String(id).trim();
    const docRef = doc(db, 'projects', docId);
    
    const cleanPayload = Object.entries(projectData).reduce((acc, [key, val]) => {
      if (val !== undefined) acc[key] = val;
      return acc;
    }, {});

    await setDoc(docRef, {
      ...cleanPayload,
      id: docId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { synced: true, docId };
  } catch (err) {
    console.warn(`[Firestore] Project ${id} update warning:`, err.message);
    return { synced: false, error: err.message };
  }
}

/**
 * Deletes a project document from Firestore with strict error trapping
 */
async function deleteProjectFromFirestore(id) {
  if (!db) {
    return { deleted: false, reason: 'Firestore DB not initialized or offline' };
  }
  try {
    const docId = String(id).trim();
    const docRef = doc(db, 'projects', docId);
    await deleteDoc(docRef);
    return { deleted: true, docId };
  } catch (err) {
    console.warn(`[Firestore] Project ${id} delete warning:`, err.message);
    return { deleted: false, error: err.message };
  }
}

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
        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] Validated successfully. Updating project "${validatedData.title}" via Promise.all...`);
        const startTime = Date.now();

        // Perform server store / MongoDB update and Firestore document update concurrently via Promise.all
        const [saved, firestoreResult] = await Promise.all([
          saveProject(validatedData),
          syncProjectUpdateToFirestore(strId, validatedData)
        ]);

        const durationMs = Date.now() - startTime;

        if (!saved) {
          console.error(`[${timestamp}] [API /api/projects/${strId}] [PUT] 500 Update returned null.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to update project in store' 
          });
        }

        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] 200 OK: Project successfully updated in ${durationMs}ms. Firestore sync status:`, firestoreResult);
        return res.status(200).json({ 
          success: true, 
          message: 'Project updated successfully', 
          data: saved,
          firestoreSynced: firestoreResult?.synced || false
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
        console.log(`[${timestamp}] [API /api/projects/${strId}] [DELETE] Initiating deletion of project with ID: "${strId}" across store and Firestore via Promise.all...`);
        const startTime = Date.now();
        
        // Concurrently execute deletion from local/MongoDB store and Firestore using Promise.all
        const [deleteResult, firestoreDeleteResult] = await Promise.all([
          deleteProject(strId),
          deleteProjectFromFirestore(strId)
        ]);

        const durationMs = Date.now() - startTime;
        
        console.log(`[${timestamp}] [API /api/projects/${strId}] [DELETE] 200 OK: Deletion completed in ${durationMs}ms:`, {
          id: strId,
          removedFromDisk: deleteResult.removedFromDisk,
          mongoDeletedCount: deleteResult.mongoDeletedCount,
          firestoreDeleted: firestoreDeleteResult?.deleted || false
        });

        return res.status(200).json({ 
          success: true, 
          message: `Project "${strId}" permanently deleted from database and storage`,
          id: strId,
          details: {
            removedFromDisk: deleteResult.removedFromDisk,
            mongoDeletedCount: deleteResult.mongoDeletedCount,
            firestoreDeleted: firestoreDeleteResult?.deleted || false,
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



import { getProjects, saveProject, deleteProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';
import { db } from '../../../../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const FIRESTORE_TIMEOUT_MS = 5000;

/**
 * Timeout wrapper for Firestore operations
 */
function withTimeout(promise, ms, operationName = 'Firestore operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timed out after ${ms}ms`)), ms)
    )
  ]);
}

/**
 * Persists an updated project document to Firestore with strict error trapping
 */
async function syncProjectUpdateToFirestore(id, projectData) {
  const timestamp = new Date().toISOString();
  if (!db) {
    console.log(`[${timestamp}] [Firestore Sync Update] Skipped: Firestore instance is null or offline`);
    return { synced: false, reason: 'Firestore DB not initialized or offline' };
  }

  const docId = String(id).trim();
  const startTime = Date.now();

  try {
    const docRef = doc(db, 'projects', docId);
    
    const cleanPayload = Object.entries(projectData).reduce((acc, [key, val]) => {
      if (val !== undefined) acc[key] = val;
      return acc;
    }, {});

    console.log(`[${timestamp}] [Firestore Sync Update] Writing update for project ID: "${docId}" with timeout ${FIRESTORE_TIMEOUT_MS}ms...`);

    await withTimeout(
      setDoc(docRef, {
        ...cleanPayload,
        id: docId,
        updatedAt: new Date().toISOString()
      }, { merge: true }),
      FIRESTORE_TIMEOUT_MS,
      `Project Firestore update setDoc (${docId})`
    );

    const durationMs = Date.now() - startTime;
    console.log(`[${timestamp}] [Firestore Sync Update] [SUCCESS] Project "${docId}" updated in Firestore in ${durationMs}ms`);
    return { synced: true, docId, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.message && err.message.includes('timed out');
    const errorOrigin = isTimeout ? 'FIRESTORE_TIMEOUT' : 'FIRESTORE_ERROR';

    console.warn(`[${timestamp}] [Firestore Sync Update] [ERROR_ORIGIN: ${errorOrigin}] Failed after ${durationMs}ms:`, {
      docId,
      error: err.message,
      code: err.code || 'UNKNOWN'
    });

    return { 
      synced: false, 
      error: err.message, 
      errorOrigin,
      isTimeout,
      code: err.code || null 
    };
  }
}

/**
 * Deletes a project document from Firestore with strict error trapping and timeout protection
 */
async function deleteProjectFromFirestore(id) {
  const timestamp = new Date().toISOString();
  if (!db) {
    console.log(`[${timestamp}] [Firestore Sync Delete] Skipped: Firestore instance is null or offline`);
    return { deleted: false, reason: 'Firestore DB not initialized or offline' };
  }

  const docId = String(id).trim();
  const startTime = Date.now();

  try {
    const docRef = doc(db, 'projects', docId);
    console.log(`[${timestamp}] [Firestore Sync Delete] Deleting project document "${docId}" from Firestore with timeout ${FIRESTORE_TIMEOUT_MS}ms...`);

    await withTimeout(
      deleteDoc(docRef),
      FIRESTORE_TIMEOUT_MS,
      `Project Firestore deleteDoc (${docId})`
    );

    const durationMs = Date.now() - startTime;
    console.log(`[${timestamp}] [Firestore Sync Delete] [SUCCESS] Project "${docId}" deleted from Firestore in ${durationMs}ms`);
    return { deleted: true, docId, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.message && err.message.includes('timed out');
    const errorOrigin = isTimeout ? 'FIRESTORE_TIMEOUT' : 'FIRESTORE_ERROR';

    console.warn(`[${timestamp}] [Firestore Sync Delete] [ERROR_ORIGIN: ${errorOrigin}] Failed after ${durationMs}ms:`, {
      docId,
      error: err.message,
      code: err.code || 'UNKNOWN'
    });

    return { 
      deleted: false, 
      error: err.message, 
      errorOrigin,
      isTimeout,
      code: err.code || null 
    };
  }
}

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/projects/${id || 'unknown'}] [${method}] Request received from IP: ${clientIp}`);

  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn(`[${timestamp}] [API /api/projects/[id]] [${method}] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Bad Request: Missing or empty project id parameter.`);
    return res.status(400).json({ 
      success: false, 
      error: 'Project ID parameter is required in the URL route.',
      errorOrigin: 'MALFORMED_PAYLOAD'
    });
  }

  const strId = String(id).trim();

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/projects/${strId}] [GET] Querying project by identifier...`);
        const projects = await getProjects();
        const found = projects.find(p => 
          String(p.id || '').trim().toLowerCase() === strId.toLowerCase() || 
          String(p._id || '').trim().toLowerCase() === strId.toLowerCase() ||
          String(p.slug || '').trim().toLowerCase() === strId.toLowerCase()
        );
        
        if (!found) {
          console.warn(`[${timestamp}] [API /api/projects/${strId}] [GET] [ERROR_ORIGIN: NOT_FOUND] 404 Not Found: No matching project.`);
          return res.status(404).json({ 
            success: false, 
            error: `Project with ID "${strId}" was not found in storage or database`,
            errorOrigin: 'NOT_FOUND'
          });
        }

        console.log(`[${timestamp}] [API /api/projects/${strId}] [GET] 200 OK: Retrieved project "${found.title}"`);
        return res.status(200).json({ 
          success: true, 
          data: found 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects/${strId}] [GET] [ERROR_ORIGIN: STORE_FETCH_ERROR] 500 Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to retrieve project record',
          errorOrigin: 'STORE_FETCH_ERROR'
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
          console.warn(`[${timestamp}] [API /api/projects/${strId}] [PUT] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Bad Request: Empty body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a valid JSON object containing updated project fields.',
            errorOrigin: 'MALFORMED_PAYLOAD'
          });
        }

        const parseResult = projectSchema.safeParse({ ...req.body, id: strId });
        if (!parseResult.success) {
          const validationIssues = parseResult.error.errors.map(err => ({
            field: err.path.join('.') || 'field',
            message: err.message
          }));
          const formattedErrors = validationIssues.map(i => `${i.field}: ${i.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/projects/${strId}] [PUT] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Validation failed: ${formattedErrors}`);
          return res.status(400).json({ 
            success: false, 
            error: `Validation error: ${formattedErrors}`,
            errorOrigin: 'MALFORMED_PAYLOAD',
            validationErrors: validationIssues,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] Validated successfully. Executing update for "${validatedData.title}"...`);
        const startTime = Date.now();

        // Perform server store / MongoDB update and Firestore document update concurrently
        const [saved, firestoreResult] = await Promise.all([
          saveProject(validatedData),
          syncProjectUpdateToFirestore(strId, validatedData)
        ]);

        const durationMs = Date.now() - startTime;

        if (!saved) {
          console.error(`[${timestamp}] [API /api/projects/${strId}] [PUT] [ERROR_ORIGIN: STORE_PERSISTENCE_ERROR] 500 Update returned null.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to persist project update in server storage',
            errorOrigin: 'STORE_PERSISTENCE_ERROR'
          });
        }

        console.log(`[${timestamp}] [API /api/projects/${strId}] [PUT] 200 OK: Project successfully updated in ${durationMs}ms. Firestore sync status:`, firestoreResult);
        return res.status(200).json({ 
          success: true, 
          message: 'Project updated successfully', 
          data: saved,
          firestoreStatus: {
            synced: firestoreResult?.synced || false,
            error: firestoreResult?.error || null,
            isTimeout: firestoreResult?.isTimeout || false,
            durationMs: firestoreResult?.durationMs || null
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects/${strId}] [PUT] [ERROR_ORIGIN: UNHANDLED_SERVER_ERROR] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while updating project',
          errorOrigin: 'UNHANDLED_SERVER_ERROR'
        });
      }

    case 'DELETE':
      try {
        console.log(`[${timestamp}] [API /api/projects/${strId}] [DELETE] Initiating deletion of project with ID: "${strId}" across store and Firestore...`);
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
            firestoreError: firestoreDeleteResult?.error || null,
            durationMs
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects/${strId}] [DELETE] [ERROR_ORIGIN: UNHANDLED_SERVER_ERROR] 500 Internal Server Error:`, {
          id: strId,
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while deleting project from database/storage',
          errorOrigin: 'UNHANDLED_SERVER_ERROR'
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

import { getProjects, saveProject } from '../../../lib/server-store';
import { projectSchema } from '../../../lib/validations';
import { db } from '../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const FIRESTORE_TIMEOUT_MS = 5000;

/**
 * Timeout wrapper for Firestore promises to avoid indefinite hangs
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
 * Persists a project document to Firestore with strict error trapping and timeout protection
 */
async function syncProjectToFirestore(projectData) {
  const timestamp = new Date().toISOString();
  if (!db) {
    console.log(`[${timestamp}] [Firestore Sync] Skipped: Firestore instance is null or offline`);
    return { synced: false, reason: 'Firestore DB not initialized or offline' };
  }

  const docId = String(projectData.id || projectData._id || Date.now());
  const startTime = Date.now();

  try {
    const docRef = doc(db, 'projects', docId);
    
    // Sanitize payload for Firestore (remove undefined values)
    const cleanPayload = Object.entries(projectData).reduce((acc, [key, val]) => {
      if (val !== undefined) acc[key] = val;
      return acc;
    }, {});

    console.log(`[${timestamp}] [Firestore Sync] Initiating write for project ID: "${docId}" with timeout ${FIRESTORE_TIMEOUT_MS}ms...`);
    
    await withTimeout(
      setDoc(docRef, {
        ...cleanPayload,
        id: docId,
        updatedAt: new Date().toISOString()
      }, { merge: true }),
      FIRESTORE_TIMEOUT_MS,
      `Project Firestore setDoc (${docId})`
    );

    const durationMs = Date.now() - startTime;
    console.log(`[${timestamp}] [Firestore Sync] [SUCCESS] Project "${docId}" synced to Firestore in ${durationMs}ms`);
    return { synced: true, docId, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.message && err.message.includes('timed out');
    const errorOrigin = isTimeout ? 'FIRESTORE_TIMEOUT' : 'FIRESTORE_ERROR';

    console.warn(`[${timestamp}] [Firestore Sync] [ERROR_ORIGIN: ${errorOrigin}] Failed after ${durationMs}ms:`, {
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

export default async function handler(req, res) {
  const { method } = req;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/projects] [${method}] Incoming request from IP: ${clientIp}`);

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/projects] [GET] Querying all projects from server repository...`);
        const fetchStartTime = Date.now();
        const projects = await getProjects();
        const fetchDuration = Date.now() - fetchStartTime;

        console.log(`[${timestamp}] [API /api/projects] [GET] 200 OK: Retrieved ${projects?.length || 0} project records in ${fetchDuration}ms`);
        return res.status(200).json({ 
          success: true, 
          count: projects?.length || 0,
          data: projects 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects] [GET] [ERROR_ORIGIN: STORE_FETCH_ERROR] 500 Internal Server Error:`, {
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to fetch projects from server repository' 
        });
      }

    case 'POST':
      try {
        console.log(`[${timestamp}] [API /api/projects] [POST] Project creation started.`);
        console.log(`[${timestamp}] [API /api/projects] [POST] Raw payload received:`, {
          title: req.body?.title,
          category: req.body?.category,
          pill: req.body?.pill,
          featured: req.body?.featured,
          technologies: req.body?.technologies,
          liveDemoUrl: req.body?.liveDemoUrl,
          githubUrl: req.body?.githubUrl,
          imageUrl: req.body?.imageUrl
        });

        // 1. Guard against empty or non-object payloads
        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
          console.warn(`[${timestamp}] [API /api/projects] [POST] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Bad Request: Missing or empty request body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a non-empty JSON object containing project details.',
            errorOrigin: 'MALFORMED_PAYLOAD'
          });
        }

        // 2. Validate with Zod schema
        const parseResult = projectSchema.safeParse(req.body);
        if (!parseResult.success) {
          const validationIssues = parseResult.error.errors.map(err => ({
            field: err.path.join('.') || 'root',
            message: err.message
          }));
          const formattedSummary = validationIssues.map(i => `${i.field}: ${i.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/projects] [POST] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Validation Failed: ${formattedSummary}`, validationIssues);
          return res.status(400).json({ 
            success: false, 
            error: `Validation error: ${formattedSummary}`,
            errorOrigin: 'MALFORMED_PAYLOAD',
            validationErrors: validationIssues,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        console.log(`[${timestamp}] [API /api/projects] [POST] Payload validated for "${validatedData.title}". Executing store persistence and Firestore sync...`);
        
        const startTime = Date.now();
        
        // Execute server store persistence and Firestore synchronization concurrently
        const [savedProject, firestoreResult] = await Promise.all([
          saveProject(validatedData),
          syncProjectToFirestore(validatedData)
        ]);

        const durationMs = Date.now() - startTime;

        if (!savedProject || (!savedProject.id && !savedProject._id)) {
          console.error(`[${timestamp}] [API /api/projects] [POST] [ERROR_ORIGIN: STORE_PERSISTENCE_ERROR] 500 Save failed: Store returned invalid result object`, savedProject);
          return res.status(500).json({ 
            success: false, 
            error: 'Database persistence failed: Unable to save project record to primary storage.',
            errorOrigin: 'STORE_PERSISTENCE_ERROR'
          });
        }

        console.log(`[${timestamp}] [API /api/projects] [POST] 201 Created: Project "${savedProject.title}" persisted successfully in ${durationMs}ms with ID: ${savedProject.id || savedProject._id}. Firestore sync result:`, firestoreResult);
        
        return res.status(201).json({ 
          success: true, 
          message: 'Project created successfully', 
          data: savedProject,
          firestoreStatus: {
            synced: firestoreResult?.synced || false,
            error: firestoreResult?.error || null,
            isTimeout: firestoreResult?.isTimeout || false,
            durationMs: firestoreResult?.durationMs || null
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/projects] [POST] [ERROR_ORIGIN: UNHANDLED_SERVER_ERROR] 500 Internal Error:`, {
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while processing project creation request',
          errorOrigin: 'UNHANDLED_SERVER_ERROR'
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

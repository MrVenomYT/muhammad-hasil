import { getProducts, saveProduct } from '../../../lib/server-store';
import { productSchema } from '../../../lib/validations';
import { db } from '../../../../firebase';
import { doc, setDoc } from 'firebase/firestore';

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
 * Persists a product document to Firestore with timeout protection
 */
async function syncProductToFirestore(productData) {
  const timestamp = new Date().toISOString();
  if (!db) {
    console.log(`[${timestamp}] [Firestore Sync Products] Skipped: Firestore instance is null or offline`);
    return { synced: false, reason: 'Firestore DB not initialized or offline' };
  }

  const docId = String(productData.id || productData._id || Date.now());
  const startTime = Date.now();

  try {
    const docRef = doc(db, 'products', docId);
    
    // Sanitize payload
    const cleanPayload = Object.entries(productData).reduce((acc, [key, val]) => {
      if (val !== undefined) acc[key] = val;
      return acc;
    }, {});

    console.log(`[${timestamp}] [Firestore Sync Products] Writing product "${docId}" with timeout ${FIRESTORE_TIMEOUT_MS}ms...`);

    await withTimeout(
      setDoc(docRef, {
        ...cleanPayload,
        id: docId,
        updatedAt: new Date().toISOString()
      }, { merge: true }),
      FIRESTORE_TIMEOUT_MS,
      `Product Firestore setDoc (${docId})`
    );

    const durationMs = Date.now() - startTime;
    console.log(`[${timestamp}] [Firestore Sync Products] [SUCCESS] Product "${docId}" synced in ${durationMs}ms`);
    return { synced: true, docId, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.message && err.message.includes('timed out');
    const errorOrigin = isTimeout ? 'FIRESTORE_TIMEOUT' : 'FIRESTORE_ERROR';

    console.warn(`[${timestamp}] [Firestore Sync Products] [ERROR_ORIGIN: ${errorOrigin}] Failed after ${durationMs}ms:`, {
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

  console.log(`[${timestamp}] [API /api/products] [${method}] Incoming request from IP: ${clientIp}`);

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/products] [GET] Querying all products from server repository...`);
        const fetchStartTime = Date.now();
        const products = await getProducts();
        const fetchDuration = Date.now() - fetchStartTime;

        console.log(`[${timestamp}] [API /api/products] [GET] 200 OK: Found ${products?.length || 0} products in ${fetchDuration}ms`);
        return res.status(200).json({ 
          success: true, 
          count: products?.length || 0,
          data: products 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products] [GET] [ERROR_ORIGIN: STORE_FETCH_ERROR] 500 Internal Error:`, {
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to fetch products from server repository',
          errorOrigin: 'STORE_FETCH_ERROR'
        });
      }

    case 'POST':
      try {
        console.log(`[${timestamp}] [API /api/products] [POST] Product creation initiated with payload:`, {
          title: req.body?.title,
          category: req.body?.category,
          price: req.body?.price,
          badge: req.body?.badge
        });

        // 1. Guard against empty payload
        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
          console.warn(`[${timestamp}] [API /api/products] [POST] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Bad Request: Missing request body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a non-empty JSON object with product details.',
            errorOrigin: 'MALFORMED_PAYLOAD'
          });
        }

        // 2. Validate with Zod product schema
        const parseResult = productSchema.safeParse(req.body);
        if (!parseResult.success) {
          const validationIssues = parseResult.error.errors.map(err => ({
            field: err.path.join('.') || 'root',
            message: err.message
          }));
          const formattedSummary = validationIssues.map(i => `${i.field}: ${i.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/products] [POST] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Validation failed: ${formattedSummary}`);
          return res.status(400).json({ 
            success: false, 
            error: `Validation error: ${formattedSummary}`,
            errorOrigin: 'MALFORMED_PAYLOAD',
            validationErrors: validationIssues,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        const startTime = Date.now();

        // 3. Persist concurrently to Server Store / MongoDB and Firestore
        const [savedProduct, firestoreResult] = await Promise.all([
          saveProduct(validatedData),
          syncProductToFirestore(validatedData)
        ]);

        const durationMs = Date.now() - startTime;

        if (!savedProduct || (!savedProduct.id && !savedProduct._id)) {
          console.error(`[${timestamp}] [API /api/products] [POST] [ERROR_ORIGIN: STORE_PERSISTENCE_ERROR] 500 Store returned invalid product object.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Database persistence failed: Unable to save product record to primary storage.',
            errorOrigin: 'STORE_PERSISTENCE_ERROR'
          });
        }

        console.log(`[${timestamp}] [API /api/products] [POST] 201 Created: Product "${savedProduct.title}" persisted in ${durationMs}ms with ID: ${savedProduct.id || savedProduct._id}. Firestore sync:`, firestoreResult);
        return res.status(201).json({ 
          success: true, 
          message: 'Product created successfully', 
          data: savedProduct,
          firestoreStatus: {
            synced: firestoreResult?.synced || false,
            error: firestoreResult?.error || null,
            isTimeout: firestoreResult?.isTimeout || false,
            durationMs: firestoreResult?.durationMs || null
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products] [POST] [ERROR_ORIGIN: UNHANDLED_SERVER_ERROR] 500 Internal Error:`, {
          message: error.message,
          stack: error.stack
        });
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while creating product',
          errorOrigin: 'UNHANDLED_SERVER_ERROR'
        });
      }

    default:
      console.warn(`[${timestamp}] [API /api/products] [${method}] 405 Method Not Allowed`);
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ 
        success: false, 
        error: `HTTP Method ${method} Not Allowed. Supported methods: GET, POST.` 
      });
  }
}

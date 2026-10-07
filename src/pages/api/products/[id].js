import { getProducts, saveProduct, deleteProduct } from '../../../lib/server-store';
import { productSchema } from '../../../lib/validations';
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
 * Updates a product document in Firestore with timeout protection
 */
async function syncProductUpdateToFirestore(id, productData) {
  const timestamp = new Date().toISOString();
  if (!db) {
    console.log(`[${timestamp}] [Firestore Sync Product Update] Skipped: Firestore instance is null or offline`);
    return { synced: false, reason: 'Firestore DB not initialized or offline' };
  }

  const docId = String(id).trim();
  const startTime = Date.now();

  try {
    const docRef = doc(db, 'products', docId);
    
    const cleanPayload = Object.entries(productData).reduce((acc, [key, val]) => {
      if (val !== undefined) acc[key] = val;
      return acc;
    }, {});

    console.log(`[${timestamp}] [Firestore Sync Product Update] Writing update for product ID: "${docId}" with timeout ${FIRESTORE_TIMEOUT_MS}ms...`);

    await withTimeout(
      setDoc(docRef, {
        ...cleanPayload,
        id: docId,
        updatedAt: new Date().toISOString()
      }, { merge: true }),
      FIRESTORE_TIMEOUT_MS,
      `Product Firestore update setDoc (${docId})`
    );

    const durationMs = Date.now() - startTime;
    console.log(`[${timestamp}] [Firestore Sync Product Update] [SUCCESS] Product "${docId}" updated in Firestore in ${durationMs}ms`);
    return { synced: true, docId, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.message && err.message.includes('timed out');
    const errorOrigin = isTimeout ? 'FIRESTORE_TIMEOUT' : 'FIRESTORE_ERROR';

    console.warn(`[${timestamp}] [Firestore Sync Product Update] [ERROR_ORIGIN: ${errorOrigin}] Failed after ${durationMs}ms:`, {
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
 * Deletes a product document from Firestore with timeout protection
 */
async function deleteProductFromFirestore(id) {
  const timestamp = new Date().toISOString();
  if (!db) {
    console.log(`[${timestamp}] [Firestore Sync Product Delete] Skipped: Firestore instance is null or offline`);
    return { deleted: false, reason: 'Firestore DB not initialized or offline' };
  }

  const docId = String(id).trim();
  const startTime = Date.now();

  try {
    const docRef = doc(db, 'products', docId);
    console.log(`[${timestamp}] [Firestore Sync Product Delete] Deleting product "${docId}" from Firestore with timeout ${FIRESTORE_TIMEOUT_MS}ms...`);

    await withTimeout(
      deleteDoc(docRef),
      FIRESTORE_TIMEOUT_MS,
      `Product Firestore deleteDoc (${docId})`
    );

    const durationMs = Date.now() - startTime;
    console.log(`[${timestamp}] [Firestore Sync Product Delete] [SUCCESS] Product "${docId}" deleted in ${durationMs}ms`);
    return { deleted: true, docId, durationMs };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const isTimeout = err.message && err.message.includes('timed out');
    const errorOrigin = isTimeout ? 'FIRESTORE_TIMEOUT' : 'FIRESTORE_ERROR';

    console.warn(`[${timestamp}] [Firestore Sync Product Delete] [ERROR_ORIGIN: ${errorOrigin}] Failed after ${durationMs}ms:`, {
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

  console.log(`[${timestamp}] [API /api/products/${id || 'unknown'}] [${method}] Request received from IP: ${clientIp}`);

  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn(`[${timestamp}] [API /api/products/[id]] [${method}] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Bad Request: Missing product id parameter.`);
    return res.status(400).json({ 
      success: false, 
      error: 'Product ID parameter is required in the URL route.',
      errorOrigin: 'MALFORMED_PAYLOAD'
    });
  }

  const strId = String(id).trim();

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/products/${strId}] [GET] Querying product by identifier...`);
        const products = await getProducts();
        const found = products.find(p => 
          String(p.id || '').trim().toLowerCase() === strId.toLowerCase() || 
          String(p._id || '').trim().toLowerCase() === strId.toLowerCase() ||
          String(p.slug || '').trim().toLowerCase() === strId.toLowerCase()
        );
        
        if (!found) {
          console.warn(`[${timestamp}] [API /api/products/${strId}] [GET] [ERROR_ORIGIN: NOT_FOUND] 404 Not Found.`);
          return res.status(404).json({ 
            success: false, 
            error: `Product with ID "${strId}" was not found in storage or database`,
            errorOrigin: 'NOT_FOUND'
          });
        }

        console.log(`[${timestamp}] [API /api/products/${strId}] [GET] 200 OK: Retrieved product "${found.title}"`);
        return res.status(200).json({ 
          success: true, 
          data: found 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products/${strId}] [GET] [ERROR_ORIGIN: STORE_FETCH_ERROR] 500 Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to retrieve product record',
          errorOrigin: 'STORE_FETCH_ERROR'
        });
      }

    case 'PUT':
      try {
        console.log(`[${timestamp}] [API /api/products/${strId}] [PUT] Product update payload received:`, {
          title: req.body?.title,
          category: req.body?.category,
          price: req.body?.price
        });

        if (!req.body || typeof req.body !== 'object') {
          console.warn(`[${timestamp}] [API /api/products/${strId}] [PUT] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Bad Request: Empty body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a valid JSON object with updated product fields.',
            errorOrigin: 'MALFORMED_PAYLOAD'
          });
        }

        const parseResult = productSchema.safeParse({ ...req.body, id: strId });
        if (!parseResult.success) {
          const validationIssues = parseResult.error.errors.map(err => ({
            field: err.path.join('.') || 'field',
            message: err.message
          }));
          const formattedErrors = validationIssues.map(i => `${i.field}: ${i.message}`).join(', ');
          console.warn(`[${timestamp}] [API /api/products/${strId}] [PUT] [ERROR_ORIGIN: MALFORMED_PAYLOAD] 400 Validation failed: ${formattedErrors}`);
          return res.status(400).json({ 
            success: false, 
            error: `Validation error: ${formattedErrors}`,
            errorOrigin: 'MALFORMED_PAYLOAD',
            validationErrors: validationIssues,
            details: parseResult.error.flatten()
          });
        }

        const validatedData = parseResult.data;
        console.log(`[${timestamp}] [API /api/products/${strId}] [PUT] Validated product data. Executing persistence...`);
        const startTime = Date.now();

        // Perform server store update and Firestore update concurrently
        const [saved, firestoreResult] = await Promise.all([
          saveProduct(validatedData),
          syncProductUpdateToFirestore(strId, validatedData)
        ]);

        const durationMs = Date.now() - startTime;

        if (!saved) {
          console.error(`[${timestamp}] [API /api/products/${strId}] [PUT] [ERROR_ORIGIN: STORE_PERSISTENCE_ERROR] 500 Update returned null.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to update product in store',
            errorOrigin: 'STORE_PERSISTENCE_ERROR'
          });
        }

        console.log(`[${timestamp}] [API /api/products/${strId}] [PUT] 200 OK: Product updated successfully in ${durationMs}ms.`);
        return res.status(200).json({ 
          success: true, 
          message: 'Product updated successfully', 
          data: saved,
          firestoreStatus: {
            synced: firestoreResult?.synced || false,
            error: firestoreResult?.error || null,
            isTimeout: firestoreResult?.isTimeout || false,
            durationMs: firestoreResult?.durationMs || null
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products/${strId}] [PUT] [ERROR_ORIGIN: UNHANDLED_SERVER_ERROR] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while updating product',
          errorOrigin: 'UNHANDLED_SERVER_ERROR'
        });
      }

    case 'DELETE':
      try {
        console.log(`[${timestamp}] [API /api/products/${strId}] [DELETE] Initiating deletion of product ID: "${strId}"...`);
        const startTime = Date.now();

        // Concurrently execute store deletion and Firestore deletion
        const [deleteResult, firestoreDeleteResult] = await Promise.all([
          deleteProduct(strId),
          deleteProductFromFirestore(strId)
        ]);

        const durationMs = Date.now() - startTime;

        console.log(`[${timestamp}] [API /api/products/${strId}] [DELETE] 200 OK: Deletion finished in ${durationMs}ms. Firestore sync result:`, firestoreDeleteResult);
        return res.status(200).json({ 
          success: true, 
          message: `Product "${strId}" permanently deleted from database and storage`,
          id: strId,
          details: {
            firestoreDeleted: firestoreDeleteResult?.deleted || false,
            firestoreError: firestoreDeleteResult?.error || null,
            durationMs
          }
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products/${strId}] [DELETE] [ERROR_ORIGIN: UNHANDLED_SERVER_ERROR] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while deleting product',
          errorOrigin: 'UNHANDLED_SERVER_ERROR'
        });
      }

    default:
      console.warn(`[${timestamp}] [API /api/products/${strId}] [${method}] 405 Method Not Allowed`);
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false, 
        error: `HTTP Method ${method} Not Allowed. Supported methods: GET, PUT, DELETE.` 
      });
  }
}

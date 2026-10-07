import { getProducts, saveProduct, deleteProduct } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/products/${id || 'unknown'}] [${method}] Request received from IP: ${clientIp}`);

  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.warn(`[${timestamp}] [API /api/products/[id]] [${method}] 400 Bad Request: Missing product id parameter.`);
    return res.status(400).json({ 
      success: false, 
      error: 'Product ID parameter is required in the URL route.' 
    });
  }

  const strId = String(id).trim();

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/products/${strId}] [GET] Querying product by identifier...`);
        const products = await getProducts();
        const found = products.find(p => 
          String(p.id || '').trim() === strId || 
          String(p._id || '').trim() === strId ||
          String(p.slug || '').trim().toLowerCase() === strId.toLowerCase()
        );
        
        if (!found) {
          console.warn(`[${timestamp}] [API /api/products/${strId}] [GET] 404 Not Found.`);
          return res.status(404).json({ 
            success: false, 
            error: `Product with ID "${strId}" was not found in storage or database` 
          });
        }

        console.log(`[${timestamp}] [API /api/products/${strId}] [GET] 200 OK: Retrieved product "${found.title}"`);
        return res.status(200).json({ 
          success: true, 
          data: found 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products/${strId}] [GET] 500 Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to retrieve product record' 
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
          console.warn(`[${timestamp}] [API /api/products/${strId}] [PUT] 400 Bad Request: Empty body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a valid JSON object with updated product fields.' 
          });
        }

        const saved = await saveProduct({ ...req.body, id: strId });
        if (!saved) {
          console.error(`[${timestamp}] [API /api/products/${strId}] [PUT] 500 Update returned null.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to update product in store' 
          });
        }

        console.log(`[${timestamp}] [API /api/products/${strId}] [PUT] 200 OK: Product successfully updated.`);
        return res.status(200).json({ 
          success: true, 
          message: 'Product updated successfully', 
          data: saved 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products/${strId}] [PUT] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while updating product' 
        });
      }

    case 'DELETE':
      try {
        console.log(`[${timestamp}] [API /api/products/${strId}] [DELETE] Initiating deletion of product ID: "${strId}"...`);
        const startTime = Date.now();
        await deleteProduct(strId);
        const durationMs = Date.now() - startTime;

        console.log(`[${timestamp}] [API /api/products/${strId}] [DELETE] 200 OK: Deletion finished in ${durationMs}ms`);
        return res.status(200).json({ 
          success: true, 
          message: `Product "${strId}" permanently deleted from database and storage`,
          id: strId
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products/${strId}] [DELETE] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while deleting product' 
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

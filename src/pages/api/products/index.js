import { getProducts, saveProduct } from '../../../lib/server-store';

export default async function handler(req, res) {
  const { method } = req;
  const timestamp = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  console.log(`[${timestamp}] [API /api/products] [${method}] Incoming request from IP: ${clientIp}`);

  switch (method) {
    case 'GET':
      try {
        console.log(`[${timestamp}] [API /api/products] [GET] Querying all products from server store...`);
        const products = await getProducts();
        console.log(`[${timestamp}] [API /api/products] [GET] Found ${products?.length || 0} product records.`);
        return res.status(200).json({ 
          success: true, 
          count: products?.length || 0,
          data: products 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products] [GET] 500 Internal Server Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Failed to fetch products from server' 
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

        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
          console.warn(`[${timestamp}] [API /api/products] [POST] 400 Bad Request: Missing request body.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Request body must be a non-empty JSON object with product details.' 
          });
        }

        if (!req.body.title || !String(req.body.title).trim()) {
          console.warn(`[${timestamp}] [API /api/products] [POST] 400 Bad Request: Missing product title.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Product title is required.' 
          });
        }

        if (!req.body.description || !String(req.body.description).trim()) {
          console.warn(`[${timestamp}] [API /api/products] [POST] 400 Bad Request: Missing product description.`);
          return res.status(400).json({ 
            success: false, 
            error: 'Product description is required.' 
          });
        }

        const startTime = Date.now();
        const savedProduct = await saveProduct(req.body);
        const durationMs = Date.now() - startTime;

        if (!savedProduct || (!savedProduct.id && !savedProduct._id)) {
          console.error(`[${timestamp}] [API /api/products] [POST] 500 Store returned invalid product object.`);
          return res.status(500).json({ 
            success: false, 
            error: 'Database persistence failed: Unable to save product record.' 
          });
        }

        console.log(`[${timestamp}] [API /api/products] [POST] 201 Created: Product "${savedProduct.title}" persisted successfully in ${durationMs}ms with ID: ${savedProduct.id || savedProduct._id}`);
        return res.status(201).json({ 
          success: true, 
          message: 'Product created successfully', 
          data: savedProduct 
        });
      } catch (error) {
        console.error(`[${timestamp}] [API /api/products] [POST] 500 Internal Error:`, error);
        return res.status(500).json({ 
          success: false, 
          error: error.message || 'Internal server error while creating product' 
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

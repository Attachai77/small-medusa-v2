import type { MedusaRequest, MedusaResponse, AuthContext } from "@medusajs/medusa";
import { generateJwtToken, Modules } from '@medusajs/utils'
import type { IProductModuleService } from "@medusajs/types";

interface MedusaRequest_ extends MedusaRequest {
  auth_context: AuthContext
}

export async function GET(req: MedusaRequest_, res: MedusaResponse) {
  const admin = req.auth_context;
  const collection = req.query.collection as string
  const collection_id = req.query.collection_id as string

  if (!admin || !admin.actor_id) {
    return res.status(401).json({
      message: 'Unauthorized',
      user: req.user || null,
      auth_context: admin || null
    });
  }

  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL) {
    return res.status(500).json({ message: 'STRAPI_URL is not defined in .env' });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not defined in .env' });
  }

  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  let collectionType = ''
  let collectionTypeId = ''
  let message = 'This is strapi generated link.'
  if (collection === 'product-category') {
    const category = await productService.retrieveProductCategory(collection_id, { select: [ '*' ] })
    if (category.metadata && typeof category.metadata.strapi_id !== 'undefined') {
      collectionTypeId = category ? `&collection_id=${category.metadata.strapi_id}` : ''
      collectionType = collection ? `&collection=${collection}` : ''
    } else {
      message = 'This product categories unsync to strapi.'
    }
  } else if (collection === 'blog') {
    collectionType = collection ? `&collection=${collection}` : ''
  }

  const token = generateJwtToken({ user_id: admin.actor_id }, {
    secret: JWT_SECRET,
    expiresIn: '1d'
  });
  const link = `${STRAPI_URL}/api/teleport?token=${token}${collectionType}${collectionTypeId}`;

  return res.json({
    message,
    link: collectionType !== '' ? link : null,
    token
  });
}
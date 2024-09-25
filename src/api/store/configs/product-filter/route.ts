import type { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import buildProductFilterConfigWorkflow from '../../../../workflows/build-product-filter-config'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')

  const category = req.query.category as string
  const product_ids = req.query.product_ids as string
  const brand_id = req.query.brand_id as string

  const { result } = await buildProductFilterConfigWorkflow(req.scope).run({
    input: {
      category_id: category,
      brand_id,
      product_ids: product_ids ? product_ids.split(',') : [],
    }
  })

  res.json({
    data: result.mappedFilterConfig,
  })
}
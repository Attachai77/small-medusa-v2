import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { IProductModuleService } from '@medusajs/types'
import {
  Modules,
} from "@medusajs/utils"
import syncProductToMeiliSearchWorkflow from '../../../../workflows/sync-product-to-meilisearch'
import ProductMeiliSearchModuleService from '../../../../modules/meilisearch/product-meilisearch/service'
import { PRODUCT_MEILISEARCH_MODULE } from '../../../../modules/meilisearch/product-meilisearch'

export async function POST(req: MedusaRequest<{ delete_all?: boolean }>, res: MedusaResponse) {
  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
  const productMeiliSearchModuleService: ProductMeiliSearchModuleService = req.scope.resolve(PRODUCT_MEILISEARCH_MODULE);

  if (req.body.delete_all) {
    await productMeiliSearchModuleService.deleteAll()
  }

  const products = await productService.listProducts({
    status: "published"
  }, {
    select: [ "id" ],
    take: 10000
  })

  const productIds = products.map((product) => product.id)
  const { result } = await syncProductToMeiliSearchWorkflow(req.scope).run({
    input: {
      productIds: productIds
    }
  })

  res.json({
    status: 'ok',
  })
}
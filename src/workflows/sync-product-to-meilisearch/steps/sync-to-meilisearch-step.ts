import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import ProductMeiliSearchModuleService from '../../../modules/meilisearch/product-meilisearch/service'
import { PRODUCT_MEILISEARCH_MODULE } from '../../../modules/meilisearch/product-meilisearch'
import { ProductMeiliSearch } from '../index'


const syncToMeiliSearchStep = createStep(
  "sync-to-meilisearch-step",
  async (input: { products: ProductMeiliSearch[] }, context) => {
    const logger: Logger = context.container.resolve('logger')

    const productMeiliSearchModuleService: ProductMeiliSearchModuleService = context.container.resolve(PRODUCT_MEILISEARCH_MODULE)
    await productMeiliSearchModuleService.bulkAddOrUpdate(input.products)

    return new StepResponse({
      products: input.products,
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
    const logger: Logger = context.container.resolve('logger')
  }
);

export default syncToMeiliSearchStep;
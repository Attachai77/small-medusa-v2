import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import getProductsStep from './steps/get-products-step'
import buildProductsStep from './steps/build-products-step'
import syncToMeiliSearchStep from './steps/sync-to-meilisearch-step'
import { ProductDTO } from '@medusajs/types'

export type SyncProductMeiliSearchWorkflowInput = {
  productIds: string[]
  sortBy?: string
}

export interface ProductMeiliSearch extends Omit<ProductDTO, 'categories'> {
  variant_sku: string[]
  synced_at: string
  // categories: string[]
  // inventory_quantity: number
}

const syncProductToMeiliSearchWorkflow = createWorkflow(
  "sync-product-to-meilisearch-workflow",
  (input: SyncProductMeiliSearchWorkflowInput) => {

    const { products: productList } = getProductsStep(input)
    const { products } = buildProductsStep({ products: productList })
    syncToMeiliSearchStep({ products })

    return new WorkflowResponse(products)
  }
)

export default syncProductToMeiliSearchWorkflow
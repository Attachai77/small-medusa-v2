import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import getProductsStep from './steps/get-products-step'
import getProductsQuantityStep from './steps/get-product-quantity-step'

export type GetProductDetailWorkflowInput = {
  productIds: string[]
  sortBy?: string
}

const getProductDetailWorkflow = createWorkflow(
  "get-product-detail-workflow",
  (input: GetProductDetailWorkflowInput) => {

    const { products: productsWithPrice } = getProductsStep(input)
    const { products: productsWithQuantity } = getProductsQuantityStep({ products: productsWithPrice })

    return new WorkflowResponse(productsWithQuantity)
  }
)

export default getProductDetailWorkflow
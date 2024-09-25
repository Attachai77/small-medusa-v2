import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import getCategoryStep from './steps/get-category-step'
import buildAttributesStep from './steps/build-attributes-step'
import buildCategoriesStep from './steps/build-categories-step'
import buildPriceStep from './steps/build-price-step'
import buildFinalStep from './steps/build-final-step'

export type BuildProductFilterWorkflowInput = {
  category_id?: string // id or handle
  brand_id?: string
  product_ids?: string[]
}

export interface ProductFilterFormOption {
  id: string,
  title: string,
  value: string,
  rank: number
}

export interface ProductFilterForm {
  title: string
  attribute: string
  filter_mode: string
  options?: ProductFilterFormOption[]
  range?: {
    min: number
    max: number
  }
}

const buildProductFilterConfigWorkflow = createWorkflow(
  "build-product-filter-config--workflow",
  (input: BuildProductFilterWorkflowInput) => {

    const { productIds, categoryIds } = getCategoryStep(input)
    const { categories } = buildCategoriesStep({
      categoryIds,
    })
    const { attributes } = buildAttributesStep({ productIds })

    const { price } = buildPriceStep({ productIds })
    const { mappedFilterConfig } = buildFinalStep({ categories, attributes, price })

    return new WorkflowResponse({
      mappedFilterConfig
    })
  }
)

export default buildProductFilterConfigWorkflow
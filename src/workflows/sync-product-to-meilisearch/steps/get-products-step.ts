import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { Modules } from '@medusajs/utils'
import { IProductModuleService } from '@medusajs/types'
import { SyncProductMeiliSearchWorkflowInput } from '../index'
import { PRODUCT_ATTRIBUTE_MODULE } from '../../../modules/product-attributes'
import type ProductAttributeService from '../../../modules/product-attributes/service'


const getProductsStep = createStep(
  "get-products-step",
  async (input: SyncProductMeiliSearchWorkflowInput, context) => {
    const productModuleService: IProductModuleService = context.container.resolve(Modules.PRODUCT)
    const attributeModuleService: ProductAttributeService = context.container.resolve(PRODUCT_ATTRIBUTE_MODULE)
    const products = await productModuleService.listProducts({
      id: input.productIds
    })

    const [ brand ] = await attributeModuleService.listProductAttributes({
      code: 'brand',
    }, { take: 1, relations: [ 'options' ] })

    for await (const product of products) {
      product['brand'] = ''
      if (!product.metadata?.brand) continue
      if (!brand || !brand.options || brand.options.length === 0) continue
      product['brand'] = brand.options.find(o => o.value === product.metadata.brand)?.title || ''
    }

    return new StepResponse({
      products,
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
    const logger: Logger = context.container.resolve('logger')
  }
);

export default getProductsStep;
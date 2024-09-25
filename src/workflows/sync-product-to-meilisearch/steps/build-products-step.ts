import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { ProductDTO } from '@medusajs/types'
import { ProductMeiliSearch } from '../index'


const buildProductsStep = createStep(
  "build-products-step",
  async (input: { products: ProductDTO[] }, context) => {
    const logger: Logger = context.container.resolve('logger')

    // const products = input.products && input.products.length > 0 && input.products.map((product) => {
    //   const variant_sku = product.variants ? product.variants.map(v => v.sku) : []
    //   const categories = product.categories ? product.categories.map(c => c.handle) : []
    //   const inventory_quantity = product.variants ? product.variants.reduce((acc, v) => {
    //     const inventory_quantity = v['inventory_quantity'] || 0
    //     return acc + inventory_quantity
    //   }, 0) : 0
    //
    //   return {
    //     ...product,
    //     variant_sku,
    //     categories,
    //     inventory_quantity
    //   }
    // }) || []

    const products = input.products && input.products.length > 0 && input.products.map((product) => {
      const variant_sku = product.variants ? product.variants.map(v => v.sku) : []
      if (product.metadata?.sku) variant_sku.push(product.metadata.sku as string)

      return {
        ...product,
        variant_sku,
        synced_at: new Date().toISOString()
      }
    }) || [] as ProductMeiliSearch[]

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

export default buildProductsStep;
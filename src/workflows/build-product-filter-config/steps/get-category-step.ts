import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { BuildProductFilterWorkflowInput } from '../index'
import { IProductModuleService, ProductDTO } from '@medusajs/types'
import { ContainerRegistrationKeys, Modules, remoteQueryObjectFromString } from '@medusajs/utils'
import ProductAttributeService from '../../../modules/product-attributes/service'
import { PRODUCT_ATTRIBUTE_MODULE } from '../../../modules/product-attributes'


const getCategoryStep = createStep(
  "get-category-step",
  async (input: BuildProductFilterWorkflowInput, context) => {
    const productModuleService: IProductModuleService = context.container.resolve(Modules.PRODUCT)
    const productAttributeService: ProductAttributeService = context.container.resolve(PRODUCT_ATTRIBUTE_MODULE)

    const productIds = input.product_ids || []
    const categoryIds = []
    if (input.category_id) {
      const catProducts = await productModuleService.listProducts({
        categories: {
          id: {
            $in: [ input.category_id ]
          }
        }
      }, {
        select: [ 'id' ],
        relations: [ 'categories' ]
      })

      const catProductIds = catProducts.map((p) => p.id)
      productIds.push(...catProductIds)
      const categoryIds = catProducts.map((p) => p.categories.map((c) => c.id)).flat()
      categoryIds.push(input.category_id)
    }

    if (input.product_ids && input.product_ids.length > 0) {
      const products = await productModuleService.listProducts({
        id: input.product_ids
      }, {
        select: [ 'id' ],
        relations: [ 'categories' ]
      })

      const catProductIds = products.map((p) => p.id)
      productIds.push(...catProductIds)
      const catIds = products.map((p) => p.categories.map((c) => c.id)).flat()
      categoryIds.push(...catIds)
    }

    if (input.brand_id) {
      const [ brandAttribute ] = await productAttributeService.listAllAttributesWithOptions({
        code: 'brand',
      })
      const brand = brandAttribute?.options.find((o) => o.id === input.brand_id)
      const brandValue = brand?.value
      const remoteQuery = context.container.resolve(
        ContainerRegistrationKeys.REMOTE_QUERY
      )
      // @ts-ignore
      const query = remoteQueryObjectFromString({
        entryPoint: "product",
        fields: [ "*", "categories.id" ],
        variables: {
          filters: {
            metadata: {
              brand: brandValue
            }
          },
        },
      })

      // @ts-ignore
      const products = await remoteQuery(query) as ProductDTO[]
      const brandProductIds = products.map((p) => p.id)
      productIds.push(...brandProductIds)

      const brandCategoryIds = products.map((p) => p.categories.map((c) => c.id)).flat()
      categoryIds.push(...brandCategoryIds)
    }

    return new StepResponse({
      productIds,
      categoryIds,
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
  }
);

export default getCategoryStep;
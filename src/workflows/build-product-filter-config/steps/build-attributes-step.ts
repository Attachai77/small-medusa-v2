import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { IProductModuleService } from '@medusajs/types'
import { Modules } from '@medusajs/utils'
import { PRODUCT_ATTRIBUTE_MODULE } from '../../../modules/product-attributes'
import type ProductAttributeService from '../../../modules/product-attributes/service'
import { ProductFilterForm } from '../index'

const buildAttributesStep = createStep(
  "build-attributes-step",
  async (input: { productIds: string[] }, context) => {
    const logger: Logger = context.container.resolve('logger')
    const productService: IProductModuleService = context.container.resolve(Modules.PRODUCT)
    const productAttributesService: ProductAttributeService = context.container.resolve(PRODUCT_ATTRIBUTE_MODULE)
    const { productIds } = input

    const productsInCategories = await productService.listProducts({
      id: productIds,
    })

    const productAttributes = await productAttributesService.listProductAttributes({
      is_filterable: true
    })
    const whitelistAttributesAllowFilter = productAttributes.map(a => a.code)

    const attributes: ProductFilterForm[] = []

    for await (const product of productsInCategories) {
      const metadata = product.metadata
      if (!metadata) continue

      for await (const key of Object.keys(metadata)) {
        if (!whitelistAttributesAllowFilter.includes(key)) continue

        const attrValue = metadata[key]
        const [ attrOption ] = await productAttributesService.listProductAttributeOptions({
          value: attrValue
        }, { take: 1, relations: [ 'attribute' ] })

        const existAttribute = attributes.find(a => a.attribute === key)
        if (!existAttribute) {
          const options = [
            {
              id: attrOption?.id,
              title: attrOption?.title,
              value: attrOption?.value,
              rank: attrOption?.rank,
            }
          ]
          attributes.push({
            attribute: key,
            title: attrOption?.attribute?.title || key,
            filter_mode: 'checkbox',
            options
          })
        } else {
          const existOption = existAttribute.options.find(o => o.value === attrValue)
          if (!existOption) {
            existAttribute.options.push({
              id: attrOption?.id,
              title: attrOption?.title,
              value: attrOption?.value,
              rank: attrOption?.rank,
            })
          }
        }
      }
    }

    return new StepResponse({
      attributes,
      productIds
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
  }
);

export default buildAttributesStep;
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { ProductDTO } from '@medusajs/types'
import { ContainerRegistrationKeys, LINKS, remoteQueryObjectFromString } from '@medusajs/utils'

const computeVariantInventoryQuantity = ({
                                           variantInventoryItems,
                                         }) => {
  const links = variantInventoryItems
  const inventoryQuantities: number[] = []

  for (const link of links) {
    const requiredQuantity = link.required_quantity
    const availableQuantity = (link.inventory?.location_levels || []).reduce(
      (sum, level) => sum + (level?.available_quantity || 0),
      0
    )

    // This will give us the maximum deliverable quantities for each inventory item
    const maxInventoryQuantity = Math.floor(
      availableQuantity / requiredQuantity
    )

    inventoryQuantities.push(maxInventoryQuantity)
  }

  // Since each of these inventory items need to be available to perform an order,
  // we pick the smallest of the deliverable quantities as the total inventory quantity.
  return inventoryQuantities.length ? Math.min(...inventoryQuantities) : 0
}

const getProductsQuantityStep = createStep(
  "get-products-quantity-step",
  async (input: { products: ProductDTO[] }, context) => {
    const logger: Logger = context.container.resolve('logger')
    const { products } = input

    const remoteQuery = context.container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    for await (const product of products) {
      const variantIds = product.variants.map((v) => v.id)
      const variants = product.variants

      // @ts-ignore
      const linkQuery = remoteQueryObjectFromString({
        service: LINKS.ProductVariantInventoryItem,
        variables: {
          filters: {
            variant_id: variantIds,
          },
        },
        fields: [
          "variant_id",
          "variant.manage_inventory",
          "required_quantity",
          "inventory.*",
          "inventory.location_levels.*",
        ],
      })


      // @ts-ignore
      const links = await remoteQuery(linkQuery)

      const variantInventoriesMap = new Map()

      links.forEach((link) => {
        const array = variantInventoriesMap.get(link.variant_id) || []

        array.push(link)

        variantInventoriesMap.set(link.variant_id, array)
      })

      for (const variant of variants) {
        if (!variant.manage_inventory) {
          continue
        }

        const links = variantInventoriesMap.get(variant.id) || []
        variant['inventory_quantity'] = computeVariantInventoryQuantity({
          variantInventoryItems: links,
        })
      }

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

export default getProductsQuantityStep;
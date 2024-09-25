import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ContainerRegistrationKeys, remoteQueryObjectFromString } from '@medusajs/utils'
import { ProductFilterForm } from '../index'

const buildPriceStep = createStep(
  "build-price-step",
  async (input: { productIds: string[] }, context) => {
    const remoteQuery = context.container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
  )

    const query = remoteQueryObjectFromString({
      entryPoint: "product",
      fields: [
        "*",
        "variants.*",
        "variants.prices.*",
      ],
      variables: {
        filters: {
          id: input.productIds,
        },
      },
    })

    const products = await remoteQuery(query)
    
    let highestPrice = 0
    const productVariants = products.map((product) => product.variants).flat()
    for (const variant of productVariants) {
      if(!variant.prices || variant.prices.length === 0) continue

      const sortedVariantPrice = variant.prices.sort((a, b) => b.amount - a.amount)

      const highestVariantPrice = sortedVariantPrice[0].amount
      if(!highestVariantPrice) continue

      if(highestVariantPrice > highestPrice) {
        highestPrice = highestVariantPrice
      }
    }

    return new StepResponse({
      price: highestPrice
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
  }
);

export default buildPriceStep;
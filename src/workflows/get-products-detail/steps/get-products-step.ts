import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { ContainerRegistrationKeys, Modules, remoteQueryObjectFromString } from '@medusajs/utils'
import { ProductDTO, IRegionModuleService } from '@medusajs/types'
import { GetProductDetailWorkflowInput } from '../index'


const getProductsStep = createStep(
  "get-products-step",
  async (input: GetProductDetailWorkflowInput, context) => {
    const logger: Logger = context.container.resolve('logger')

    const regionService: IRegionModuleService = context.container.resolve(Modules.REGION)
    const regions = await regionService.listRegions({
      currency_code: 'thb'
    })
    const thailandRegion = regions[0]
    if (!thailandRegion) {
      logger.error("Thailand region not found")
      throw new Error("Thailand region not found")
    }

    const order = {}
    if (input.sortBy) {
      order[input.sortBy] = "desc"
    }

    const remoteQuery = context.container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )
    // @ts-ignore
    const query = remoteQueryObjectFromString({
      entryPoint: "product",
      fields: [
        "*",
        "type.*",
        "collection.*",
        "options.*",
        "tags.*",
        "images.*",
        "variants.*",
        "variants.calculated_price.*",
        "categories.handle",
      ],
      variables: {
        filters: {
          id: input.productIds,
        },
        order,
        "variants.calculated_price": {
          context: {
            region_id: thailandRegion.id,
            currency_code: thailandRegion.currency_code,
          },
        },
      },
    })

    // @ts-ignore
    const products = await remoteQuery(query) as ProductDTO[]

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
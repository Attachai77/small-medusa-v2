import type { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import HomepageBannerService from "../../../modules/strapi/homepage-banner/service"
import { HOMEPAGE_BANNER_MODULE } from "../../../modules/strapi/homepage-banner"


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')
  try {

    const homepageBannerService: HomepageBannerService = req.scope.resolve(
      HOMEPAGE_BANNER_MODULE,
    )

    const result = await homepageBannerService.getListAll()
    res.json({
      data: result,
    })
  } catch (error) {
    logger.error('Error in GET homepage banner:', error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

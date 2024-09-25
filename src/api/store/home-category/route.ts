import type { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { HOME_CATEGORY_MODULE } from '../../../modules/strapi/home-category'
import HomeCategoryService from '../../../modules/strapi/home-category/service'


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')
  try {
    const homeCategoryService: HomeCategoryService = req.scope.resolve(
      HOME_CATEGORY_MODULE,
    )

    const locale = (req.query.locale || 'th') as string

    const result = await homeCategoryService.getListAll({ locale })
    res.json({
      data: result,
    })
  } catch (error) {
    logger.error(`Error in GET home category: ${error.message}`, error)
    res.status(500).json({
      error: error?.message || 'Internal Server Error',
    })
  }
}

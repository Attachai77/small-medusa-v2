import type { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import type MiniCategoryService from "../../../../modules/strapi/mini-category/service"
import { MINI_CATEGORY_MODULE } from "../../../../modules/strapi/mini-category"


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')
  try {

    const miniCategoryService: MiniCategoryService = req.scope.resolve(
      MINI_CATEGORY_MODULE,
    )
    const result = await miniCategoryService.getListAll(req.params.locale)
    res.json({
      data: result,
    })
  } catch (error) {
    logger.error('Error in GET mini category:', error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}
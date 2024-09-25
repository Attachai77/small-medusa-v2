import type { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import type CmsPageService from '../../../../modules/strapi/cms-page/service'
import { CMS_PAGE_MODULE } from '../../../../modules/strapi/cms-page'


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')

  try {
    const cmsPageService: CmsPageService = req.scope.resolve(
      CMS_PAGE_MODULE,
    )

    const result = await cmsPageService.getCmsPageList(req.params.locale)
    res.json({
      data: result,
    })
  } catch (error) {
    logger.error('Error in GET cms page:', error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

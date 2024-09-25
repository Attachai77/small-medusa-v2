import type { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import BlockService from '../../../../../modules/strapi/block/service'
import { BLOCK_MODULE } from '../../../../../modules/strapi/block'


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')

  try {
    const blockService: BlockService = req.scope.resolve(
      BLOCK_MODULE,
    )

    const result = await blockService.getBlockBySlug(req.params.slug, req.params.locale)
    res.json({
      data: result,
    })
  } catch (error) {
    logger.error('Error in GET block:', error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

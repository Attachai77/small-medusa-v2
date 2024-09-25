import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { UpdateTopSearchBody } from '../../../../types/top-search'
import SearchLogModuleService from '../../../../modules/search-log/service'
import { SEARCH_LOG_MODILE_SERVICE } from '../../../../modules/search-log'

export const PATCH = async (req: MedusaRequest<UpdateTopSearchBody>, res: MedusaResponse) => {
  const id = req.params.id
  const { search, product_id } = req.body
  const searchLogService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)

  const topSearch = await searchLogService.updateTopSearches({
    id,
    search,
    product_id
  })

  res.json({
    success: true,
    message: 'Top search updated',
    data: topSearch
  })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id
  const searchLogService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)

  await searchLogService.softDeleteTopSearches(id)

  res.json({
    success: true,
    message: 'Top search deleted'
  })
}
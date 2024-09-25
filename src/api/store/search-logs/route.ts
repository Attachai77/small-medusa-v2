import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { SEARCH_LOG_MODILE_SERVICE } from '../../../modules/search-log'
import type SearchLogModuleService from '../../../modules/search-log/service'

interface SearchLogReq {
  search: string
}

export const POST = async (req: MedusaRequest<SearchLogReq>, res: MedusaResponse) => {
  const searchLogModuleService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)
  if (!req.body.search) {
    res.status(400).json({
      message: 'some value is required'
    })
    return
  }

  await searchLogModuleService.saveSearchLog(req.body)
  res.json({
    message: 'success'
  })
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const searchLogModuleService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)
  const logs = await searchLogModuleService.listTopSearches({}, {
    order: {
      count: 'desc'
    }
  })

  res.json({
    top_searches: logs,
    recent_searches: []
  })
}
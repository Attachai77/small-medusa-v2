import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { type CreateTopSearchesBody, type RecommendSettingForm, TopSearchType } from '../../../types/top-search'
import type SearchLogModuleService from '../../../modules/search-log/service'
import { SEARCH_LOG_MODILE_SERVICE } from '../../../modules/search-log'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const searchLogService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)
  const topSearches = await searchLogService.listTopSearches({
    type: TopSearchType.RECOMMEND
  }, {
    order: {
      created_at: 'ASC'
    }
  })

  res.json({
    success: true,
    data: topSearches
  })
}

export const POST = async (req: MedusaRequest<CreateTopSearchesBody>, res: MedusaResponse) => {
  const data = req.body as unknown as RecommendSettingForm[]
  const searchLogService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)

  const topSearches = await searchLogService.listTopSearches({
    type: TopSearchType.RECOMMEND
  }, {
    order: {
      created_at: 'ASC'
    }
  })
  await searchLogService.softDeleteTopSearches(topSearches)
  data.map(async (item) => {
    const recommend: CreateTopSearchesBody = {
      id: item.id,
      search: item.name_value,
      type: TopSearchType.RECOMMEND,
      product_id: null,
      uri: item.uri_value,
      deleted_at: null
    }
    if (item.id !== '') {
      await searchLogService.restoreTopSearches([recommend.id])
      await searchLogService.updateTopSearches(recommend)
    } else {
      await searchLogService.createTopSearches(recommend)
    }
  })
  const topSearche = await searchLogService.listTopSearches({
    type: TopSearchType.RECOMMEND
  })

  res.json({
    success: true,
    message: 'Top search was save successfully.',
    data: topSearche
  })
}


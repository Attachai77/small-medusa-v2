import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { type CreateTopSearchesBody, TopSearchType } from '../../../types/top-search'
import type SearchLogModuleService from '../../../modules/search-log/service'
import { SEARCH_LOG_MODILE_SERVICE } from '../../../modules/search-log'
import type ConfigDataModuleService from "../../../modules/config-data/service";
import { CONFIG_DATA_MODULE } from "../../../modules/config-data";
import { ConfigDataPath } from '../../../types/config-data'
import { findConfigDataByPath } from '../../../admin/utils/config-data';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const configDataModuleService: ConfigDataModuleService = req.scope.resolve(CONFIG_DATA_MODULE);
  const config = await configDataModuleService.getByPaths([
    ConfigDataPath.TOP_SEARCH_GENERAL_ENABLED,
    ConfigDataPath.TOP_SEARCH_GENERAL_DISPLAY_MODE,
  ]);
  const enabled_value = findConfigDataByPath(config, ConfigDataPath.TOP_SEARCH_GENERAL_ENABLED)
  const display_mode = findConfigDataByPath(config, ConfigDataPath.TOP_SEARCH_GENERAL_DISPLAY_MODE)
  
  const searchLogService: SearchLogModuleService = req.scope.resolve(SEARCH_LOG_MODILE_SERVICE)
  const topSearches: CreateTopSearchesBody[] = []
  if (enabled_value === "1") {
    const recommends = await searchLogService.listTopSearches({
      type: TopSearchType.RECOMMEND
    }, {
      order: {
        created_at: 'ASC'
      },
      skip: 0,
      take: display_mode === "search-engine" ? 0 : 5,
    })
    recommends.map((recommend) => {
      recommend.id = undefined
      recommend.count = undefined
      recommend.created_at = undefined
      recommend.updated_at = undefined
      recommend.deleted_at = undefined
      topSearches.push(recommend)
    })
    const searchEngines = await searchLogService.listTopSearches({
      type: TopSearchType.SEARCH_ENGINE
    }, {
      order: {
        count: 'DESC'
      },
      skip: 0,
      take: display_mode === "recommend" ? 0 : 5 - topSearches.length,
    })
    searchEngines.map((searchEngine) => {
      searchEngine.id = undefined
      searchEngine.count = undefined
      searchEngine.created_at = undefined
      searchEngine.updated_at = undefined
      searchEngine.deleted_at = undefined
      topSearches.push(searchEngine)
    })
  }

  res.json({
    success: true,
    data: topSearches
  })
}
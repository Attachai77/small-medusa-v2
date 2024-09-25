import { type SubscriberConfig } from "@medusajs/medusa";
import SearchLogModuleService from '../../modules/search-log/service'
import { SEARCH_LOG_MODILE_SERVICE } from '../../modules/search-log'

export default async function searchLogCreatedHandler({ event, container }) {
  const searchLogModuleService: SearchLogModuleService = container.resolve(SEARCH_LOG_MODILE_SERVICE);
  const data = event.data
  const searchQuery = data.search
  const [ existingSearchLog ] = await searchLogModuleService.listTopSearches({
    search: searchQuery
  })

  if (existingSearchLog) {
    const searchLogCount = existingSearchLog.count + 1
    await searchLogModuleService.updateTopSearches([ {
      id: existingSearchLog.id,
      count: searchLogCount
    } ])
  } else {
    await searchLogModuleService.createTopSearches({
      search: searchQuery,
      count: 1
    })
  }
}

export const config: SubscriberConfig = {
  event: "search-log.created",
  context: {
    subscriberId: "search-log-created",
  }
};

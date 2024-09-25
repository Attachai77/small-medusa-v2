import { MedusaService } from '@medusajs/utils'
import TopSearch from './models/top-search'
import SearchLog from './models/search-logs'
import RedisEventBusService from '@medusajs/event-bus-redis/dist/services/event-bus-redis'
import { IProductModuleService } from '@medusajs/types'
import { Logger } from '@medusajs/medusa'

// @ts-ignore
class SearchLogModuleService extends MedusaService({
  SearchLog,
  TopSearch,
}) {
  protected logger: Logger;
  protected eventBusService: RedisEventBusService;
  protected productService: IProductModuleService;
  public Events = {
    SEARCH_LOG_CREATED: 'search-log.created',
  }

  constructor({ logger, EventBus, Product }: any) {
    super(...arguments);

    this.logger = logger;
    this.eventBusService = EventBus;
    this.productService = Product;
  }

  async saveSearchLog(data: { search: string }) {
    // const products = await this.productService.listProducts({}, { take: 2 })
    const searchLog = await this.createSearchLogs(data)
    this.eventBusService.emit({
      name: this.Events.SEARCH_LOG_CREATED,
      data: searchLog,
    }).then(() => {
      this.logger.info(`Search log created: ${searchLog.search}`)
    })
  }

}

export default SearchLogModuleService
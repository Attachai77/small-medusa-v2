import { Logger, type SubscriberConfig } from "@medusajs/medusa";
import ProductMeiliSearchModuleService from '../../modules/meilisearch/product-meilisearch/service'
import { PRODUCT_MEILISEARCH_MODULE } from '../../modules/meilisearch/product-meilisearch'

export default async function meiliSearchProductCreatedOrUpdateHandler({ event, container }) {
  const productId = event.data.id;
  const logger: Logger = container.resolve("logger");

  try {
    const productMeiliSearchModuleService: ProductMeiliSearchModuleService = container.resolve(PRODUCT_MEILISEARCH_MODULE)
    await productMeiliSearchModuleService.delete(productId)
    logger.info("Product deleted event received [DRAFT], to delete from MeiliSearch");
  } catch (error) {
    logger.error(`Error syncing product deleted to MeiliSearch, error: ${error.message}`, error);
  }
}

export const config: SubscriberConfig = {
  event: ['product.deleted'],
  context: {
    subscriberId: "meilisearch-product-deleted",
  }
};

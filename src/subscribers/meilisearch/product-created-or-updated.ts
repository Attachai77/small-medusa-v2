import { Logger, type SubscriberConfig } from "@medusajs/medusa";
import syncProductToMeiliSearchWorkflow from '../../workflows/sync-product-to-meilisearch'
import { IProductModuleService } from '@medusajs/types'
import { Modules, ProductStatus } from '@medusajs/utils'
import ProductMeiliSearchModuleService from '../../modules/meilisearch/product-meilisearch/service'
import { PRODUCT_MEILISEARCH_MODULE } from '../../modules/meilisearch/product-meilisearch'

export default async function meiliSearchProductCreatedOrUpdateHandler({ event, container }) {
  const productId = event.data.id;
  const logger: Logger = container.resolve("logger");
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
  const product = await productService.retrieveProduct(productId);

  try {
    if (product.status === ProductStatus.PUBLISHED) {
      const { result } = await syncProductToMeiliSearchWorkflow(container).run({
        input: {
          productIds: [ productId ]
        }
      })
      logger.info("Product created or updated event received, to sync to MeiliSearch");
    }

    if (product.status === ProductStatus.DRAFT) {
      const productMeiliSearchModuleService: ProductMeiliSearchModuleService = container.resolve(PRODUCT_MEILISEARCH_MODULE)
      await productMeiliSearchModuleService.delete(productId)
      logger.info("Product archived event received [DRAFT], to delete from MeiliSearch");
    }

  } catch (error) {
    logger.error(`Error syncing product to MeiliSearch, error: ${error.message}`, error);
  }
}

export const config: SubscriberConfig = {
  event: [ 'product.created', 'product.updated' ],
  context: {
    subscriberId: "meilisearch-product-created-or-updated",
  }
};

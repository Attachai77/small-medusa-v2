import type { SubscriberArgs, SubscriberConfig, Logger } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/utils";
import type ProductStrapiService from "../../../modules/strapi/product/service";
import { PRODUCT_STRAPI_MODULE } from "../../../modules/strapi/product";
import { ProductEvents } from "@medusajs/utils"

export default async function strapiProductDeletedHandler({
                                                            event: { data },
                                                            container,
                                                          }: SubscriberArgs<{ id: string }>) {
  const logger: Logger = container.resolve('logger');
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
  const productStrapiService: ProductStrapiService = container.resolve(PRODUCT_STRAPI_MODULE);
  await productStrapiService.deleteProductByMedusaId(data.id);
  logger.info(`The product ${data.id} was deleted from Strapi`);
}

export const config: SubscriberConfig = {
  event: "product.deleted",
  context: {
    subscriberId: "strapi-product-deleted"
  }
};
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import type { Logger } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import type ProductStrapiService from "../../../modules/strapi/product/service"
import { PRODUCT_STRAPI_MODULE } from "../../../modules/strapi/product"
import type { ProductStrapi } from "../../../modules/strapi/product/type"
import { ProductEvents } from "@medusajs/utils"

export default async function strapiProductCreatedHandler({
                                                            event: { data },
                                                            container,
                                                          }: SubscriberArgs<{ id: string }>) {
  const logger: Logger = container.resolve('logger')
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT)
  const productStrapiService: ProductStrapiService = container.resolve(PRODUCT_STRAPI_MODULE)
  const product = await productService.retrieveProduct(data.id)
  if (product) {
    const created = await productStrapiService.createProduct({
      medusa_id: product.id,
      title: product.title,
      handle: product.handle,
    } as ProductStrapi)
    if (created) {
      await productService.updateProducts(product.id, {
        metadata: {
          strapi_id: created.id
        }
      })
    }
    return logger.info(`The product ${product.id} was created`)
  }
}


export const config: SubscriberConfig = {
  event: "product.created",
  context: {
    subscriberId: "strapi-product-created"
  }
};

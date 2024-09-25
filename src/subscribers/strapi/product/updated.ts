import type { SubscriberArgs, SubscriberConfig, Logger } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/utils";
import type ProductStrapiService from "../../../modules/strapi/product/service";
import { PRODUCT_STRAPI_MODULE } from "../../../modules/strapi/product";
import type { ProductStrapi } from "../../../modules/strapi/product/type";
import type { ProductDTO } from "@medusajs/types"
import { ProductEvents } from "@medusajs/utils"

async function updateOrCreateStrapiProduct(
  productService: IProductModuleService,
  productStrapiService: ProductStrapiService,
  product: ProductDTO,
  logger: Logger
) {
  const strapiProduct = await productStrapiService.retrieveProductByMedusaId(product.id);
  const productData: ProductStrapi = {
    medusa_id: product.id,
    title: product.title,
    handle: product.handle,
  };

  let updatedProduct: ProductStrapi;
  if (strapiProduct) {
    const strapiId = product?.metadata?.strapi_id as number;
    updatedProduct = await productStrapiService.updateProduct(strapiId, productData);
    logger.info(`The product ${product.id} was updated in Strapi`);
  } else {
    updatedProduct = await productStrapiService.createProduct(productData);
    logger.info(`The product ${product.id} was created in Strapi`);
  }

  if (updatedProduct) {

    if (updatedProduct.id !== product.metadata?.strapi_id) {
      const updatedMetadata = {
        ...product.metadata,
        strapi_id: updatedProduct.id
      };

      await productService.updateProducts(product.id, {
        metadata: updatedMetadata
      });
    }
  }
}

export default async function strapiProductUpdatedHandler({
                                                            event: { data },
                                                            container,
                                                          }: SubscriberArgs<{ id: string }>) {
  const logger: Logger = container.resolve('logger');
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT);
  const productStrapiService: ProductStrapiService = container.resolve(PRODUCT_STRAPI_MODULE);

  const product = await productService.retrieveProduct(data.id);

  if (!product) {
    logger.warn(`Product with id ${data.id} not found`);
    return;
  }
  await updateOrCreateStrapiProduct(productService, productStrapiService, product, logger);
}

export const config: SubscriberConfig = {
  event: "product.updated",
  context: {
    subscriberId: "strapi-product-updated"
  }
};

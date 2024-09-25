import type { SubscriberArgs, SubscriberConfig, Logger } from "@medusajs/medusa"
import { PRODUCT_CATEGORY_STRAPI_MODULE } from "../../modules/strapi/product-categories"
import type ProductCategoryStrapiService from "../../modules/strapi/product-categories/service";

// subscriber function
export default async function productCategoryDeletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const categoryId = data.id
  const logger: Logger = container.resolve('logger')
	const productCategoryStrapiModuleService: ProductCategoryStrapiService = container.resolve(PRODUCT_CATEGORY_STRAPI_MODULE)
  const existingCategory = await productCategoryStrapiModuleService.getProductCategoryByMedusaId(categoryId)
  if (existingCategory) {
    await productCategoryStrapiModuleService.deleteProductCategoryByMedusaId(categoryId)
  }
  return logger.info(`The product-category ${categoryId} was deleted`)
}

// subscriber config
export const config: SubscriberConfig = {
  event: 'product-category.deleted',
}

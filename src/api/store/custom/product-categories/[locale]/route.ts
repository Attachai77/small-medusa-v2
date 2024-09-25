import type { MedusaRequest, MedusaResponse, } from "@medusajs/medusa";
import { PRODUCT_CATEGORY_STRAPI_MODULE } from "../../../../../modules/strapi/product-categories"
import type ProductCategoryStrapiService from "../../../../../modules/strapi/product-categories/service";
import type { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const logger = req.scope.resolve("logger");
  const locale = req.params.locale
  const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  const productCategoryStrapiService: ProductCategoryStrapiService = req.scope.resolve(PRODUCT_CATEGORY_STRAPI_MODULE)
  const categories = await productModuleService.listProductCategories(
    {
      is_internal: false,
      is_active: true,
    },
    {
      select: [
        'id',
        'name',
        'description',
        'handle',
        'mpath',
        'is_active',
        'is_internal',
        'rank',
        'parent_category_id',
      ],
      order: {
        'rank': 'ASC'
      },
      take: 9999,
      skip: 0
    }
  )
  const strapiCategories = await productCategoryStrapiService.getListAll(locale)
  const result = productCategoryStrapiService.buildCategoryTree(categories, null, strapiCategories)
  res.json({
    data: result
  });
}

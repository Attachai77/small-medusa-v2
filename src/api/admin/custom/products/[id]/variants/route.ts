import type { MedusaRequest, MedusaResponse, } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../../../../modules/product-variant-images"
import type ProductVariantImagesService from "../../../../../../modules/product-variant-images/service";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const logger = req.scope.resolve("logger");
  const id = req.params.id
  const productVariantImagesService: ProductVariantImagesService = req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE)
  const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  const product = await productModuleService.retrieveProduct(id, {
    relations: [
      'variants',
      'images'
    ]
  })
  const variant_ids = product.variants.map((variant) => variant.id)
  const variant_images = await productVariantImagesService.listProductVariantImagesModules(
    {
      variant_id: variant_ids
    },
    {
      take: 9999,
      skip: 0,
      order: {
        rank: "ASC"
      }
    }
  )
  const new_variants = []
  product.variants.map((item) => {
    const images = []
    variant_images.map((image) => {
      if (image.variant_id === item.id) {
        images.push(image)
      }
    })
    const new_item = {
      ...item,
      images
    }
    new_variants.push(new_item)
  })
  res.json({
    variants: new_variants
  });
}

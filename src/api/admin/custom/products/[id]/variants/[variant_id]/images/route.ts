import type { MedusaRequest, MedusaResponse, } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../../../../../../modules/product-variant-images"
import type ProductVariantImagesService from "../../../../../../../../modules/product-variant-images/service";
import type { ProductVariantDTO } from "../../../../../../../../types/variants";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const logger = req.scope.resolve("logger");
  const params = req.params
  const body = req.body as ProductVariantDTO
  const images = body.images
  const productVariantImagesService: ProductVariantImagesService = req.scope.resolve(PRODUCT_VARIANT_IMAGES_MODULE)
  await productVariantImagesService.deleteProductVariantImagesModules({
    variant_id: [ params.variant_id ]
  })
  await Promise.all(images.map(async (url, rank) => {
    await productVariantImagesService.createProductVariantImagesModules([
      {
        variant_id: params.variant_id,
        url,
        rank
      },
    ])
  }))
  const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  const product = await productModuleService.retrieveProduct(params.id, {
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

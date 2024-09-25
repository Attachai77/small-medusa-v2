import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { PRODUCT_VARIANT_IMAGES_MODULE } from "../../../../../modules/product-variant-images"
import type ProductVariantImagesService from "../../../../../modules/product-variant-images/service";
import { PRODUCT_STRAPI_MODULE } from "../../../../../modules/strapi/product";
import type ProductStrapiService from "../../../../../modules/strapi/product/service";
import type { ProductStrapiResponse } from "../../../../../modules/strapi/product/type";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {

  if (req?.query?.locale) {
    getStrapiProduct(req, res)
  } else {
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
    const new_product = {
      ...product,
      variants: new_variants
    }
    res.json({
      product: new_product
    });
  }


}

async function getStrapiProduct(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<MedusaResponse> {
  const logger = req.scope.resolve("logger");
  const productModuleService = req.scope.resolve<IProductModuleService>(Modules.PRODUCT);
  const productStrapiService = req.scope.resolve<ProductStrapiService>(PRODUCT_STRAPI_MODULE);

  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  const { locale } = req.query;
  if (!locale) {
    return res.status(400).json({ message: "Invalid locale" });
  }

  try {
    const product = await productModuleService.retrieveProduct(id, {
      select: [ 'id', 'title', 'handle', 'thumbnail', 'status', 'description', 'metadata' ],
      relations: [ 'variants', 'options', 'tags', 'type', 'collection', 'categories' ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let strapiProduct: ProductStrapiResponse | null = await productStrapiService.retrieveProductByMedusaId(id);

    if (locale && locale !== process.env.MEDUSA_DEFAULT_LOCALE && strapiProduct?.attributes?.localizations?.data?.length > 0) {
      strapiProduct = strapiProduct?.attributes?.localizations?.data[0] as ProductStrapiResponse;
    }

    return res.status(200).json({ products: strapiProduct });

  } catch (error) {
    logger.error(`Error fetching product: ${error}`);
    return res.status(500).json({ message: "An error occurred while fetching the product" });
  }
}

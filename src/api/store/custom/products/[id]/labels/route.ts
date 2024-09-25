import type { MedusaRequest, MedusaResponse, } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types"
import { Modules } from '@medusajs/utils'
import type ProductAttributeService from '../../../../../../modules/product-attributes/service'
import { PRODUCT_ATTRIBUTE_MODULE } from '../../../../../../modules/product-attributes'

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const logger = req.scope.resolve("logger");
  const id = req.params.id
  const productModuleService = req.scope.resolve<IProductModuleService>(Modules.PRODUCT)
  const productAttributesService: ProductAttributeService = req.scope.resolve(PRODUCT_ATTRIBUTE_MODULE)

  const product = await productModuleService.retrieveProduct(id)

  const productLabel = product?.metadata?.label
  if (!productLabel) {
    res.json({
      label: null
    });
    return
  }

  const productAttr = await productAttributesService.listProductAttributeOptions({
    value: productLabel
  })

  const label = productAttr[0] || null

  res.json({
    label: label,
  });
}

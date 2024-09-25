import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type { IProductModuleService } from "@medusajs/types";
import { Modules } from "@medusajs/utils";
import type ProductAttributeService from "../../../../../../modules/product-attributes/service";
import { PRODUCT_ATTRIBUTE_MODULE } from "../../../../../../modules/product-attributes";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger = req.scope.resolve("logger");
  const id = req.params.id;
  const { attribute_code, option_value } = req.query;

  const productModuleService = req.scope.resolve<IProductModuleService>(
    Modules.PRODUCT
  );
  const productAttributesService: ProductAttributeService = req.scope.resolve(
    PRODUCT_ATTRIBUTE_MODULE
  );

  try {
    const product = await productModuleService.retrieveProduct(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const attributeOptions = await productAttributesService.retrieveProductAttributeOptionByCodeAndValue(attribute_code as string, option_value as string)
    const customAttributesOption = attributeOptions[0] || null;

    res.json({
      custom_attributes_options: customAttributesOption,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "An error occurred while fetching product attribute options" });
  }
}

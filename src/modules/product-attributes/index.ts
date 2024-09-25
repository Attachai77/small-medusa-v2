import { Module } from "@medusajs/utils"
import ProductAttributeService from "./service"

export const PRODUCT_ATTRIBUTE_MODULE = "productAttributeModuleService"

// @ts-ignore
export default Module(PRODUCT_ATTRIBUTE_MODULE, {
  service: ProductAttributeService,
});


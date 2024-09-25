import ProductCategoryStrapiService from "./service"
import { Module } from "@medusajs/utils"

export const PRODUCT_CATEGORY_STRAPI_MODULE = "productCategoryStrapiModuleService"

// @ts-ignore
export default Module(PRODUCT_CATEGORY_STRAPI_MODULE, {
  service: ProductCategoryStrapiService,
})
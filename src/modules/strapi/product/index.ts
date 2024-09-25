import ProductStrapiService from "./service"
import { Module } from "@medusajs/utils"

export const PRODUCT_STRAPI_MODULE = "productStrapiModuleService"

export default Module(PRODUCT_STRAPI_MODULE, {
    service: ProductStrapiService,
})
import ProductMeiliSearchModuleService from "./service";
import { Module } from "@medusajs/utils";

export const PRODUCT_MEILISEARCH_MODULE = "productMeiliSearchModuleService";

// @ts-ignore
export default Module(PRODUCT_MEILISEARCH_MODULE, {
  service: ProductMeiliSearchModuleService,
});


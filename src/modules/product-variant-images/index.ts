import ProductVariantImagesService from "./service";
import { Module } from "@medusajs/utils";
import ProductVariantImagesModule from "./models/product-variant-images";

export const PRODUCT_VARIANT_IMAGES_MODULE = "productVariantImagesModuleService";

// @ts-ignore
export default Module(PRODUCT_VARIANT_IMAGES_MODULE, {
	service: ProductVariantImagesService,
	// @ts-ignore
	model: ProductVariantImagesModule,
});

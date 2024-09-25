import { MedusaService } from "@medusajs/utils"
import ProductVariantImagesModule from "./models/product-variant-images";
import type { Logger } from "@medusajs/medusa";

// @ts-ignore
export default class ProductVariantImagesService extends MedusaService({
  ProductVariantImagesModule,
}) {
  // private logger: Logger
  //
  // constructor(container) {
  //   super(container)
  //   this.logger = container.logger
  // }
}
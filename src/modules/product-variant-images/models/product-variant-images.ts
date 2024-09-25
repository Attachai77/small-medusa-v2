import { model } from "@medusajs/utils";

// @ts-ignore
const ProductVariantImagesModule = model.define("product_variant_images", {
  // @ts-ignore
  id: model.id().primaryKey(),
  // @ts-ignore
  variant_id: model.text(),
  // @ts-ignore
  url: model.text(),
  // @ts-ignore
  metadata: model.json().nullable(),
  // @ts-ignore
  rank: model.number().default(0)
});

export default ProductVariantImagesModule;

import { model } from "@medusajs/utils"
import ProductAttributeOptionModel from "./product-attribute-option"

// @ts-ignore
const ProductAttributeModel = model.define("product_attribute", {
  // @ts-ignore
  id: model.id({ prefix: "pa" }).primaryKey(),
  // @ts-ignore
  title: model.text(),
  // @ts-ignore
  code: model.text().unique(),
  // @ts-ignore
  description: model.text().nullable(),
  // @ts-ignore
  is_filterable: model.boolean().default(false),
  // @ts-ignore
  is_required: model.boolean().default(false),
  // @ts-ignore
  is_unique: model.boolean().default(false),
  // @ts-ignore
  rank: model.number().default(0),
  // @ts-ignore
  metadata: model.json().nullable(),
  // @ts-ignore
  status: model.boolean().default(true),
  // @ts-ignore
  type: model.enum([ "text", "textarea", "texteditor", "date", "datetime", "boolean", "multiselect", "select", "media_image", "swatch_visual", "swatch_text" ]),
  // @ts-ignore
  options: model.hasMany(() => ProductAttributeOptionModel, {
    mappedBy: "attribute",
  }),
})

export default ProductAttributeModel
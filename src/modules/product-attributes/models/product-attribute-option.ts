import { model } from "@medusajs/utils"
import ProductAttributeModel from "./product-attribute"

// @ts-ignore
const ProductAttributeOptionModel = model.define("product_attribute_option", {
  // @ts-ignore
  id: model.id({ prefix: "pao" }).primaryKey(),
  // @ts-ignore
  title: model.text(),
  // @ts-ignore
  value: model.text(),
  // @ts-ignore
  rank: model.number().default(0),
  // @ts-ignore
  metadata: model.json().nullable(),
  // @ts-ignore
  attribute: model.belongsTo(() => ProductAttributeModel, {
    mappedBy: "options",
  }),
})

export default ProductAttributeOptionModel
import { model } from "@medusajs/utils"

// @ts-ignore
const TopSearchModel = model.define("top_search", {
  // @ts-ignore
  id: model.id({ prefix: "ts" }).primaryKey(),
  // @ts-ignore
  search: model.text(),
  // @ts-ignore
  count: model.number().default(0),
  // @ts-ignore
  type: model.enum([ "search-engine", "recommend" ]).default("search-engine"),
  // @ts-ignore
  product_id: model.text().nullable(),

  uri: model.text().nullable(),
})

export default TopSearchModel
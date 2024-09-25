import { model } from "@medusajs/utils"

// @ts-ignore
const SearchLog = model.define("search_logs", {
  // @ts-ignore
  id: model.id({ prefix: "slog" }).primaryKey(),
  // @ts-ignore
  search: model.text(),
})

export default SearchLog
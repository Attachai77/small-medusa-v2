import MiniCategoryService from "./service"
import { Module } from "@medusajs/utils"

export const MINI_CATEGORY_MODULE = "miniCategoryService"

// @ts-ignore
export default Module(MINI_CATEGORY_MODULE, {
  service: MiniCategoryService,
})
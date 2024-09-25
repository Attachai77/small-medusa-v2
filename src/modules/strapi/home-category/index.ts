import { Module } from "@medusajs/utils"
import HomeCategoryService from './service'

export const HOME_CATEGORY_MODULE = "homeCategoryService"

export default Module(HOME_CATEGORY_MODULE, {
  service: HomeCategoryService,
})
import CmsPageService from "./service"
import { Module } from "@medusajs/utils"

export const CMS_PAGE_MODULE = "cmsPageService"

export default Module(CMS_PAGE_MODULE, {
  service: CmsPageService,
})
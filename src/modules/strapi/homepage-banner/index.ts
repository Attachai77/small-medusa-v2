import HomepageBannerService from "./service"
import { Module } from "@medusajs/utils"

export const HOMEPAGE_BANNER_MODULE = "homepageBannerService"

export default Module(HOMEPAGE_BANNER_MODULE, {
  service: HomepageBannerService,
})
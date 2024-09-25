import { Module } from "@medusajs/utils"
import AdminModuleService from './service'
import { AdminLog } from './models/admin-logs'

export const ADMIN_MODULE = "adminModuleService"

export default Module(ADMIN_MODULE, {
  service: AdminModuleService,
  models: [AdminLog],
})

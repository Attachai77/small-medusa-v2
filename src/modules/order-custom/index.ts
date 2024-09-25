import { Module } from '@medusajs/utils'
import OrderCustomModel from './models/order-custom'
import OrderCustomService from './service'

export const ORDER_CUSTOM_MODULE = 'orderCustomModuleService'

// @ts-ignore
export default Module(ORDER_CUSTOM_MODULE,{
  service: OrderCustomService,
  model: OrderCustomModel,
})
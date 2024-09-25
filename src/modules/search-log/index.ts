import { Module } from '@medusajs/utils'
import SearchLogModuleService from './service'

export const SEARCH_LOG_MODILE_SERVICE = 'searchLogModuleService';

// @ts-ignore
export default Module(SEARCH_LOG_MODILE_SERVICE, {
  service: SearchLogModuleService,
});
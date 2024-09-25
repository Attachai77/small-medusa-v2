import BlockService from "./service"
import { Module } from "@medusajs/utils"

export const BLOCK_MODULE = "blockService"

export default Module(BLOCK_MODULE, {
  service: BlockService,
})
import ConfigDataModuleService from "./service";
import { Module } from "@medusajs/utils";
import { ConfigDataModel } from "./models/config-data";

export const CONFIG_DATA_MODULE = "configDataModuleService";

// @ts-ignore
export default Module(CONFIG_DATA_MODULE, {
  service: ConfigDataModuleService,
  // @ts-ignore
  models: [ConfigDataModel],
});

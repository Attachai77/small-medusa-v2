import { model } from "@medusajs/utils";

// @ts-ignore
export const ConfigDataModel = model.define("config_data", {
  // @ts-ignore
  id: model.id().primaryKey(),
  // @ts-ignore
  path: model.text(),
  // @ts-ignore
  value: model.text(),
  // @ts-ignore
  created_by: model.text(),
  // @ts-ignore
  updated_by: model.text().nullable(),
  // @ts-ignore
  metadata: model.json().nullable(),
});

export default ConfigDataModel;

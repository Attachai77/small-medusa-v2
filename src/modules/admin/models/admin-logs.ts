import { model } from "@medusajs/utils"

// @ts-ignore
export const AdminLog = model.define("admin-logs", {
  // @ts-ignore
  id: model.id().primaryKey(),
  // @ts-ignore
  action: model.text(),
  // @ts-ignore
  actor_id: model.text(),
  // @ts-ignore
  resource_id: model.text().nullable(),
  // @ts-ignore
  resource_type: model.text().nullable(),
  // @ts-ignore
  metadata: model.json().nullable(),
})

export default AdminLog

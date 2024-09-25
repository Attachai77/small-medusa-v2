import { model, OrderStatus } from "@medusajs/utils";

// @ts-ignore
const OrderCustomModel = model.define("order", {
  id: model.id().primaryKey(),
  display_id: model.text(),
  region_id: model.text(),
  customer_id: model.text(),
  version: model.number(),
  sales_channel_id: model.text(),
  status: model.enum(OrderStatus),
  is_draft_order: model.boolean(),
  email: model.text(),
  currency_code: model.text(),
  shipping_address_id: model.text().nullable(),
  billing_address_id: model.text().nullable(),
  no_notification: model.boolean().nullable(),
  metadata: model.json().nullable(),
});

export default OrderCustomModel;
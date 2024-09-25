import type { SubscriberArgs, SubscriberConfig, Logger } from "@medusajs/medusa"
// import type { ICustomerModuleService, INotificationModuleService } from "@medusajs/types";
// import { ModuleRegistrationName } from "@medusajs/utils";

// subscriber function
export default async function customerCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const customerId = data.id
  const logger: Logger = container.resolve('logger')
  logger.info(`The customer ${customerId} was creating`)
  // const notificationModuleService: INotificationModuleService = container.resolve(ModuleRegistrationName.NOTIFICATION)
  // const customerService: ICustomerModuleService = container.resolve(ModuleRegistrationName.CUSTOMER)
  // const customer = await customerService.retrieveCustomer(customerId, { select: [ '*' ] })
  // await notificationModuleService.createNotifications({
  //   to: customer.email,
  //   channel: "email",
  //   template: process.env.SENDGRID_CUSTOMER_CREATED,
  //   data:{
  //     first_name: customer.first_name,
  //     landing_page_url: process.env.STORE_CORS,
  //   },
  // })
  return logger.info(`The customer ${customerId} was created`)
}

// subscriber config
export const config: SubscriberConfig = {
  event: 'customer.created',
}

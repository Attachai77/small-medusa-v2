import type { Logger, SubscriberConfig } from "@medusajs/medusa";
import generateRunningNoWorkflow from '../../workflows/generate-running-no'
import { RunningNumberConfigType } from '../../types/running-number-config'
import { IOrderModuleService, IPaymentModuleService, MedusaContainer } from '@medusajs/types'
import { Modules } from '@medusajs/utils'
import { ContainerRegistrationKeys, remoteQueryObjectFromString } from '@medusajs/utils'
import { OrderDetailDTO } from '@medusajs/types/dist/order/common'

export default async function orderPlacedHandler(
  { event, container }
) {
  const logger: Logger = container.resolve("logger");
  const orderId = event.data.id;
  // const orderCustomService: OrderCustomService = container.resolve(ORDER_CUSTOM_MODULE)
  const orderService: IOrderModuleService = container.resolve(Modules.ORDER);

  let orderNo = ''
  try {
    const { result } = await generateRunningNoWorkflow(container).run({
      input: {
        type: RunningNumberConfigType.ORDER_NO,
      }
    })

    orderNo = result.generatedNo
  } catch (error) {
    logger.error(`Failed to run generate order number workflow, orderId:${orderId}, error: ${error.message}`, error);
    return
  }

  if (!orderNo) {
    logger.error(`Failed to generate order number, orderId:${orderId}, error: No order number generated`);
    return
  }

  try {
    const updateMetadata = await getUpdateOrderMetadata(container, orderId)

    await orderService.updateOrders([ {
      id: orderId,
      metadata: {
        order_no: orderNo,
        ...updateMetadata
      }
    } ])
    // await orderCustomService.updateOrderCustoms([{
    //   id: orderId,
    //   display_id: orderNo,
    //   metadata: {
    //     order_no: orderNo
    //   }
    // }])

    logger.info(`Updated order_no, orderId:${orderId}, orderNo:${orderNo}`);
  } catch (error) {
    logger.error("Failed to update order custom", { error });
  }
}

const getUpdateOrderMetadata = async (container: MedusaContainer, orderId: string) => {
  const paymentModuleService: IPaymentModuleService = container.resolve(Modules.PAYMENT)
  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  // @ts-ignore
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        id: orderId
      },
      limit: 1,
      order: {
        created_at: "DESC",
      },
    },
    fields: [ 'payment_collections.*' ],
  })

  // @ts-ignore
  const [ order ] = await remoteQuery(queryObject) as OrderDetailDTO[]
  const payment_collection = order?.payment_collections
  if (!order || !payment_collection || payment_collection.length === 0) {
    return {
      invoice_no: '',
      payment_id: '',
      payment_collection_id: '',
    }
  }

  const paymentCollection = await paymentModuleService.retrievePaymentCollection(payment_collection[0].id, {
    relations: [ 'payments' ]
  })
  const payment = paymentCollection?.payments?.[0]
  const invoice_no = payment?.data?.invoiceNo || ''
  const payment_id = payment?.id || ''
  const payment_collection_id = paymentCollection?.id || ''

  return {
    invoice_no,
    payment_id,
    payment_collection_id,
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};



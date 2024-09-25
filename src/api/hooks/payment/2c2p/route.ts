import { Logger, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import jwt from 'jsonwebtoken'
import { IPaymentModuleService } from '@medusajs/types'
import { Modules } from '@medusajs/utils'
import { PaymentHookData } from './type'
import { ResponseCode } from '../../../../modules/payment/2c2p/types'

interface PaymentHookRequest {
  payload: string;
}

export const POST = async (req: MedusaRequest<PaymentHookRequest>, res: MedusaResponse) => {
  const logger: Logger = req.scope.resolve('logger')
  const { payload } = req.body
  const secretKey = process.env.PAYMENT_2C2P_MERCHANT_SECRET_KEY
  const decodedPayload = jwt.verify(payload, secretKey) as PaymentHookData
  const paymentSessionId = decodedPayload.userDefined1

  const paymentService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT)
  const payment = await paymentService.listPayments({
    payment_session_id: paymentSessionId
  }, {
    relations: [ 'payment_collection' ]
  }).then((res) => res[0])

  if (payment?.payment_collection) {
    const paymentCollectionMetaData = {
      ...payment.payment_collection.metadata || {},
      payment_post_back: decodedPayload
    }

    await paymentService.updatePaymentCollections(payment.payment_collection.id, {
      metadata: paymentCollectionMetaData
    })
  }

  // capture payment
  logger.info(`Payment hook received for payment session ${paymentSessionId}, paymentId ${payment.id} , response code: ${decodedPayload.respCode}`)
  if (payment && decodedPayload.respCode === ResponseCode.SUCCESS) {
    await paymentService.capturePayment({
      payment_id: payment.id,
    })
    logger.info(`Payment captured for payment session ${paymentSessionId}, paymentId ${payment.id}`)
  }

  res.status(200).json({ success: true })
}
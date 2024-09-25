import { EOL } from "os"
import axios, { AxiosInstance } from 'axios'
import BigNumber from "bignumber.js";
import jwt from 'jsonwebtoken'

import {
  CreatePaymentProviderSession,
  MedusaContainer,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  ProviderWebhookPayload,
  UpdatePaymentProviderSession,
  WebhookActionResult,
} from "@medusajs/types"
import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentSessionStatus,
  isPaymentProviderError,
  isPresent,
} from "@medusajs/utils"
import {
  ErrorIntentStatus,
  PaymentIntentOptions, PaymentTokenEncodedResponse, PaymentTokenResponse, ResponseCode,
} from "../types"
import { Logger } from '@medusajs/medusa'

interface ConfigOptions {
  host: string
  merchantId: string
  secretKey: string
}

abstract class Payment2C2PBase extends AbstractPaymentProvider {
  protected readonly options_: any
  protected stripe_: any
  protected container_: MedusaContainer
  protected _2c2pClient: AxiosInstance
  protected logger: Logger

  protected constructor(container: MedusaContainer, options: ConfigOptions) {
    // @ts-ignore
    super(...arguments)
    this.container_ = container
    this.options_ = options
    this._2c2pClient = this.init()
    this.logger = container['logger']
  }

  protected init(): AxiosInstance {
    this.validateOptions(this.options_)
    return axios.create({
      baseURL: this.options_.host,
    })
  }

  abstract get paymentIntentOptions(): PaymentIntentOptions

  private validateOptions(options: ConfigOptions): void {
    if (!options.host) {
      throw new Error("2C2P: Missing host in options")
    }

    if (!options.merchantId) {
      throw new Error("2C2P: Missing merchantId in options")
    }

    if (!options.secretKey) {
      throw new Error("2C2P: Missing secretKey in options")
    }
  }

  getPaymentIntentOptions(): PaymentIntentOptions {
    const options: PaymentIntentOptions = {}
    options.payment_channel = this.paymentIntentOptions.payment_channel

    // can be used to set the payment method types
    return options
  }

  // prepare payload for 2c2p
  async initiatePayment(
    input: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    this.logger.info('starting initiatePayment')
    const { session_id } = input.context
    const { amount } = input
    const intentRequestData = this.getPaymentIntentOptions()

    const sessionData = {
      merchantID: this.options_.merchantId,
      invoiceNo: session_id,
      description: "Medusa Payment",
      amount: amount,
      currencyCode: 'THB',
      paymentChannel: intentRequestData.payment_channel,
    } as PaymentProviderSessionResponse["data"]

    this.logger.info('end initiatePayment')

    return {
      data: {
        id: session_id,
        ...sessionData
      },
    }
  }

  async updatePayment(
    input: UpdatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { context, data, amount } = input

    this.logger.info('starting updatePayment')
    try {
      this.logger.info('end updatePayment')
      return {
        data: {
          ...data,
          amount,
          context
        }
      }
    } catch (e) {
      return this.buildError("An error occurred in updatePayment", e)
    }
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProviderError
    | {
    status: PaymentSessionStatus
    data: PaymentProviderSessionResponse["data"]
  }
  > {
    this.logger.info('starting authorizePayment')

    paymentSessionData.invoiceNo = 'INV-' + new Date().getTime().toString()

    const backendReturnUrl = `${process.env.MEDUSA_BACKEND_URL}/hooks/payment/2c2p`
    const frontendReturnUrl = `${process.env.MEDUSA_FRONTEND_URL}/api/callbacks/payment`

    const payload = {
      merchantID: paymentSessionData.merchantID,
      invoiceNo: paymentSessionData.invoiceNo,
      description: paymentSessionData.description,
      amount: paymentSessionData.amount,
      currencyCode: paymentSessionData.currencyCode,
      paymentChannel: paymentSessionData.paymentChannel,

      // locale: 'en',
      frontendReturnUrl,
      backendReturnUrl,
      userDefined1: paymentSessionData?.id || '',
      userDefined2: context?.cart_id || '',
      userDefined3: 'userDefined3',
      userDefined4: 'userDefined4',
      userDefined5: 'userDefined5',
    }

    const secretKey = this.options_.secretKey
    const encodedPayload = jwt.sign(payload, secretKey)

    const paymentToken = await this._2c2pClient.post<PaymentTokenEncodedResponse>('/payment/4.3/paymentToken', {
      payload: encodedPayload
    })
      .then((res) => {
        return res.data?.payload
      })
      .catch((e) => {
        this.logger.error(`[2c2p] An error occurred in authorizePayment, 2c2p paymentToken error:${e.message}`, e)
        return this.buildError("An error occurred in authorizePayment", e)
      })

    if (typeof paymentToken !== 'string') {
      return paymentToken
    }

    const decodedPaymentToken = jwt.verify(paymentToken, secretKey) as PaymentTokenResponse
    if (decodedPaymentToken.respCode !== ResponseCode.SUCCESS) {
      const errMessage = `An error occurred in authorizePayment, 2c2p paymentToken error: ${decodedPaymentToken.respCode}, ${decodedPaymentToken.respDesc}`
      this.logger.error(errMessage)
      return this.buildError(errMessage, new Error(decodedPaymentToken.respDesc))
    }

    const status = await this.getPaymentStatus(paymentSessionData)

    return {
      data: {
        ...paymentSessionData,
        payment_token_result: decodedPaymentToken
      },
      status
    }
  }

  async getPaymentStatus(
    _paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    return PaymentSessionStatus.AUTHORIZED
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      const id = paymentSessionData.id as string
      return {} as PaymentProviderSessionResponse["data"]
    } catch (error) {
      if (error.payment_intent?.status === ErrorIntentStatus.CANCELED) {
        return error.payment_intent
      }

      return this.buildError("An error occurred in cancelPayment", error)
    }
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const id = paymentSessionData.id as string

    return {
      ...paymentSessionData
    }
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    return await this.cancelPayment(paymentSessionData)
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    const id = paymentSessionData.id as string

    try {
    } catch (e) {
      return this.buildError("An error occurred in refundPayment", e)
    }

    return paymentSessionData
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse["data"]> {
    try {
      this.logger.info('starting retrievePayment')
      const id = paymentSessionData.id as string

      return paymentSessionData
    } catch (e) {
      return this.buildError("An error occurred in retrievePayment", e)
    }
  }

  async updatePaymentData(sessionId: string, data: Record<string, unknown>) {
    try {
      this.logger.info('starting updatePaymentData')
      console.log({ sessionId, data })

      // Prevent from updating the amount from here as it should go through
      // the updatePayment method to perform the correct logic
      if (isPresent(data.amount)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot update amount, use updatePayment instead"
        )
      }

      // return (await this.stripe_.paymentIntents.update(sessionId, {
      //   ...data,
      // })) as unknown as PaymentProviderSessionResponse["data"]

      return {
        ...data,
      } as unknown as PaymentProviderSessionResponse["data"]

    } catch (e) {
      return this.buildError("An error occurred in updatePaymentData", e)
    }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const {
      data,
      rawData,
      headers
    } = webhookData

    try {
      switch (data.event_type) {
        case "authorized_amount":
          return {
            action: "authorized",
            data: {
              session_id: (data.metadata as Record<string, any>).session_id,
              amount: new BigNumber(data.amount as number)
            }
          }
        case "success":
          return {
            action: "captured",
            data: {
              session_id: (data.metadata as Record<string, any>).session_id,
              amount: new BigNumber(data.amount as number)
            }
          }
        default:
          return {
            action: "not_supported"
          }
      }
    } catch (e) {
      return {
        action: "failed",
        data: {
          session_id: (data.metadata as Record<string, any>).session_id,
          amount: new BigNumber(data.amount as number)
        }
      }
    }
  }


  protected buildError(
    message: string,
    error: PaymentProviderError | Error
  ): PaymentProviderError {
    return {
      error: message,
      code: "code" in error ? error.code : "unknown",
      detail: isPaymentProviderError(error)
        ? `${error.error}${EOL}${error.detail ?? ""}`
        : "detail" in error
          ? error.detail
          : error.message ?? "",
    }
  }
}

export default Payment2C2PBase
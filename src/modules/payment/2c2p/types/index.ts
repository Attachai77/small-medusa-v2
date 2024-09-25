export enum PaymentProviderKeys {
  QR_CASH = 'qr-cash',
}

export enum GroupCode {
  IMBANK = "IMBANK",
  BCTRL = "BCTRL",
  OTCTR = "OTCTR",
  WEBPAY = "WEBPAY",
}

export enum ChannelCode {
  CC = "CC",    // Global Card Payment (CC)

  PPQR = "PPQR", // PromptPay QR (PPQR)

  // e-Wallet
  TRUEMONEY = "TRUEMONEY", // TrueMoney Wallet (TRUEMONEY)
  LINE = "LINE", // LINE Pay (LINE)
  SHPPAY = "SHPPAY", // ShopeePay

  WEBPAY_123 = "123",   // 123 Service (123)
}

export interface PaymentIntentOptions {
  payment_method_types?: string[]
  payment_channel?: ChannelCode[] | GroupCode[]
}

export const ErrorCodes = {
  PAYMENT_INTENT_UNEXPECTED_STATE: "payment_intent_unexpected_state",
}

export const ErrorIntentStatus = {
  SUCCEEDED: "succeeded",
  CANCELED: "canceled",
}

export enum ResponseCode {
  SUCCESS = "0000",
  TXT_IS_PENDING = "0001",
  TXT_IS_CANCELLED = "0003",
  TXT_NOT_FOUND = "2002",
  SATTLED = "4110",
  REQUIRED_PAYLOAD = "6102",
}

export interface PaymentTokenEncodedResponse {
  respCode: ResponseCode,
  respDesc: string,
  payload: string,
}

export interface PaymentTokenResponse {
  "webPaymentUrl": string,
  "paymentToken": string,
  "respCode": ResponseCode,
  "respDesc": string,
}

export interface PaymentInquiry {
  "merchantID": string
  "invoiceNo": string
  "amount": number
  "currencyCode": string
  "transactionDateTime": string
  "agentCode": string
  "channelCode": string
  "approvalCode": string
  "referenceNo": string
  "accountNo": string
  "cardToken": string
  "issuerCountry": string
  "eci": string
  "installmentPeriod": number
  "interestType": string
  "interestRate": number
  "installmentMerchantAbsorbRate ": number
  "recurringUniqueID": string
  "fxAmount": number
  "fxRate": number
  "fxCurrencyCode": string
  "userDefined1": string
  "userDefined2": string
  "userDefined3": string
  "userDefined4": string
  "userDefined5": string
  "acquirerReferenceNo": string
  "acquirerMerchantId": string
  "cardType": string
  "idempotencyID": string
  "respCode": ResponseCode
  "respDesc": string
}
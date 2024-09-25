import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import jwt from 'jsonwebtoken'
import axios, { AxiosInstance } from 'axios'


const http2C2P: AxiosInstance = axios.create({
  baseURL: process.env.PAYMENT_2C2P_API_URL
})

interface GetTokenResponse {
  "webPaymentUrl": string,
  "paymentToken": string,
  "respCode": string,
  "respDesc": string
}

interface OptionItem {
  "sequenceNo": number,
  "name": string,
  "code": string,
  "iconUrl": string,
  "logoUrl": string,
  "default": boolean,
  "expiration": boolean,
  groups?: OptionItem[]
  channels?: OptionItem[]
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const secretKey = process.env.PAYMENT_2C2P_MERCHANT_SECRET_KEY || 'secret'
  const merchantID = process.env.PAYMENT_2C2P_MERCHANT_ID || 'merchantID'

  const getTokenPayload = {
    "merchantID": merchantID,
    "invoiceNo": new Date().getTime().toString(),
    "description": "for get available payments",
    "amount": 5000.00,
    "currencyCode": "THB",
    "paymentChannel": []
  }

  const encodedPayload = jwt.sign(getTokenPayload, secretKey)
  const _2c2pToken = await request2C2PToken(encodedPayload)
  const decoded2c2pToken = jwt.verify(_2c2pToken, secretKey) as GetTokenResponse
  if (decoded2c2pToken.respCode !== '0000') {
    res.json({
      payments: [],
      message: 'Something went wrong',
      _2c2pResponse: decoded2c2pToken
    })
    return
  }

  const paymentToken = decoded2c2pToken.paymentToken
  const paymentOptions = await getPaymentOptions(paymentToken)
  const payments = await mappingPaymentOptions(paymentToken, paymentOptions)

  res.json({
    payments,
  })
}

const request2C2PToken = async (encodedPayload: string) => {
  const res = await http2C2P.post('/payment/4.3/paymentToken', {
    payload: encodedPayload,
  })
  return res.data?.payload as string
}

const getPaymentOptions = async (paymentToken: string): Promise<OptionItem[]> => {
  const res = await http2C2P.post('/payment/4.3/paymentOption', {
    paymentToken,
    locale: 'en'
  })

  return res.data?.channelCategories || []
}

const mappingPaymentOptions = async (paymentToken: string, catOptions: OptionItem[]) => {
  if (!catOptions || catOptions.length === 0) return []

  for await (const catOption of catOptions) {
    const categoryCode = catOption.code
    for await (const group of catOption.groups) {
      const groupCode = group.code
      const res = await http2C2P.post('/payment/4.3/paymentOptionDetails', {
        paymentToken,
        locale: 'en',
        categoryCode,
        groupCode
      })
      group.channels = res.data?.channels || []
    }
  }

  return catOptions
}
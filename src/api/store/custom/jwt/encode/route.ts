import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import jwt from 'jsonwebtoken'

interface Payload {
  "merchantID": string,
  "invoiceNo": string,
  "description": string,
  "amount": number,
  "currencyCode": string,
  "paymentChannel": string[],
}

export const POST = async (req: MedusaRequest<Payload>, res: MedusaResponse) => {
  const secretKey = process.env.PAYMENT_2C2P_MERCHANT_SECRET_KEY || 'secret'
  const token = jwt.sign(req.body, secretKey)

  const decoded = jwt.verify(token, secretKey)

  res.json({
    token,
    decoded
  })
}
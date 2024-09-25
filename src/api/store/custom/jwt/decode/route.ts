import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import jwt from 'jsonwebtoken'

interface Payload {
  "token": string,
}

export const POST = async (req: MedusaRequest<Payload>, res: MedusaResponse) => {
  const secretKey = process.env.PAYMENT_2C2P_MERCHANT_SECRET_KEY || 'secret'

  const decoded = jwt.verify(req.body.token, secretKey)

  res.json({
    decoded
  })
}
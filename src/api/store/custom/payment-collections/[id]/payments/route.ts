import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type { IPaymentModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
) {
  const { id } = req.params

  const paymentService: IPaymentModuleService = req.scope.resolve(Modules.PAYMENT)
  const paymentCollection = await paymentService.retrievePaymentCollection(id, {
    relations: [ "payments" ]
  })

  const payments = paymentCollection.payments.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  res.json({
    payments
  })
}

// export const AUTHENTICATE = true
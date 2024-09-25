import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import { ContainerRegistrationKeys, remoteQueryObjectFromString, } from '@medusajs/utils'
import { OrderDetailDTO } from '@medusajs/types'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const invoiceNo = req.params.invoice_id
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        metadata: {
          invoice_no: invoiceNo
        }
      },
      limit: 1,
      order: {
        created_at: "DESC",
      },
    },
    fields: [ '*' ],
  })

  const [ order ] = await remoteQuery(queryObject) as OrderDetailDTO[]
  res.json({
    order: order || null
  })
}
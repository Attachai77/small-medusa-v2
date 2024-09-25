import generateRunningNoWorkflow from '../../../../../workflows/generate-running-no'
import type { RunningNumberConfigType } from '../../../../../types/running-number-config'
import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa'

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
) {
  const type = req.params.type as RunningNumberConfigType
  const { result } = await generateRunningNoWorkflow(req.scope).run({
    input: {
      type,
    }
  })

  res.json(result);
}
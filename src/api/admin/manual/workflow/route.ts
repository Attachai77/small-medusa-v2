import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import myWorkflow from '../../../../workflows/my-workflow'
import helloWorldWorkflow from '../../../../workflows/hello-world'

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await myWorkflow(req.scope).run({
    input: {
      id: "1",
      name: "test"
    }
  })

  const { result: helloWorld } = await helloWorldWorkflow(req.scope).run({
    input: {
      name: "John"
    }
  })

  res.status(200).json({
    status: "ok",
    result,
    helloWorld
  })
}
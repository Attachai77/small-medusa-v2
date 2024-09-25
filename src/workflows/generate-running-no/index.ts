import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/workflows-sdk"
import prepareConfigDataStep from "./steps/prepare-config-data-step"
import generateStep from './steps/generate-step'
import type { RunningNumberConfigType } from '../../types/running-number-config'

export type GenerateRunningNumberWorkflowInput = {
  type: RunningNumberConfigType
}

const generateRunningNoWorkflow = createWorkflow(
  "generate-running-number-workflow",
  (input: GenerateRunningNumberWorkflowInput) => {
    const configDataMap = prepareConfigDataStep(input)

    const generatedNo = generateStep(configDataMap)

    return new WorkflowResponse(generatedNo)
  }
)

export default generateRunningNoWorkflow
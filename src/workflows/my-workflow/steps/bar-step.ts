import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { MyWorkflowInput } from '../index'

const barStep = createStep(
  "bar-step",
  async (input: MyWorkflowInput, context) => {

    const previousData = {
      message: "this is previous data bar-step",
      ...input
    }
    return new StepResponse({
      message: "bar-step passed,this is output data from bar-step",
      ...input
    }, {
      previousData
    })
  },
  async (input, context) => {
    console.log(input.previousData)
    // Do something with the previous data
  }
)

export default barStep
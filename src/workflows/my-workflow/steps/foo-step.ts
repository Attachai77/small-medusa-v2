import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { MyWorkflowInput } from '../index'

export const fooStep = createStep(
  "foo-step",
  async (input: MyWorkflowInput, context) => {

    const previousData = {
      message: "this is previous data",
      ...input
    }

    return new StepResponse({
      message: "foo-step passed,this is output data",
      ...input
    }, {
      previousData
    })
  },
  async (input, context) => {
    console.log(input.previousData)

    // Do something with the previous data
  }
);
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { GenerateRunningNumberWorkflowInput } from '../index'
import type ConfigDataModuleService from '../../../modules/config-data/service'
import { CONFIG_DATA_MODULE } from '../../../modules/config-data'
import type { Logger } from '@medusajs/medusa'
import { getInitialConfigTemplateByType } from '../../../utils/generate-running-no'


const prepareConfigDataStep = createStep(
  "prepare-config-step",
  async (input: GenerateRunningNumberWorkflowInput, context) => {
    const logger: Logger = context.container.resolve('logger')
    logger.info("Running prepare-config-step")

    const configTemplate = getInitialConfigTemplateByType(input.type)

    const paths = Object.keys(configTemplate).map((key: string) => configTemplate[key].path)

    const configDataService: ConfigDataModuleService =
      context.container.resolve(CONFIG_DATA_MODULE)

    const configs = await configDataService.listConfigDataModels({
      path: paths
    })

    await Promise.all(Object.keys(configTemplate).map((key: string) => {
      const path = configTemplate[key].path
      const config = configs.find((c) => c.path === path)
      configTemplate[key].value = config?.value || configTemplate[key].value
    }))

    const configMap = {
      is_enable: configTemplate.is_enable.value === '1',
      format: configTemplate.format.value,
      counter_increment: Number(configTemplate.counter_increment.value),
      counter_padding: Number(configTemplate.counter_padding.value),
      current_no: Number(configTemplate.current_no.value),
      current_prefix: configTemplate.current_prefix.value
    }

    return new StepResponse({
      configMap,
      configTemplate,
      type: input.type
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
    const logger: Logger = context.container.resolve('logger')
    logger.info("Running prepare-config-step")
  }
);

export default prepareConfigDataStep;
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import dayjs from 'dayjs'
import { Modules } from '@medusajs/utils'
import type { IOrderModuleService } from "@medusajs/types"
import type { Logger } from '@medusajs/medusa'
import type {
  RunningNumberConfigMap,
  RunningNumberConfigTemplate,
  RunningNumberConfigType
} from '../../../types/running-number-config'
import { CONFIG_DATA_MODULE } from '../../../modules/config-data'
import type ConfigDataModuleService from '../../../modules/config-data/service'

const generateStep = createStep(
  "generate-step",
  async (input: {
    configMap: RunningNumberConfigMap,
    configTemplate: RunningNumberConfigTemplate,
    type: RunningNumberConfigType
  }, context) => {
    const logger: Logger = context.container.resolve('logger')
    logger.info("Running generate-step")

    if (!input.configMap.is_enable) {
      return new StepResponse({
        generatedNo: Date.now().toString()
      })
    }

    const configDataService: ConfigDataModuleService = context.container.resolve(CONFIG_DATA_MODULE)
    const orderService: IOrderModuleService = context.container.resolve(Modules.ORDER)

    const { configMap, configTemplate, type } = input

    const formats = configMap.format.split(/}{|{|}/g)
    const current_prefix = configMap.current_prefix
    const d = dayjs()

    let result = ''
    for await (const format of formats) {
      if (!format) continue;

      switch (format.toLowerCase()) {
        case 'yy':
          result += d.format('YY')
          break;
        case 'yyyy':
          result += d.format('YYYY')
          break;
        case 'mm':
          result += d.format('MM')
          break;
        case 'm':
          result += d.format('M')
          break;
        case 'dd':
          result += d.format('DD')
          break;
        case 'd':
          result += d.format('D')
          break;
        case 'counter': {
          let nextCounterIncrement = configMap.counter_increment
          if (configMap.current_prefix === result) {
            nextCounterIncrement = configMap.current_no + configMap.counter_increment

            const updateData = {
              [input.type]: {
                current_no: { path: configTemplate.current_no.path, value: String(nextCounterIncrement) },
                current_prefix: { path: configTemplate.current_prefix.path, value: current_prefix },
              }
            }

            await configDataService.saveRunningNumberConfig(updateData, '')
          } else {
            if (!configMap.current_no || configMap.current_no === 0) {
              const lastedOrderSamePrefix = await orderService.listOrders({
                // @ts-ignore
                // display_id: `LIKE("%${result}%")`
              }, {
                order: {
                  created_at: 'DESC'
                }
              }).then(orders => orders[0])

              if (lastedOrderSamePrefix) {
                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                const orderNo = lastedOrderSamePrefix['display_id']
                const orderNoSplit = Number(orderNo.split(result).join(''))
                nextCounterIncrement = orderNoSplit + configMap.counter_increment
              }
            }

            const updateData = {
              [input.type]: {
                current_no: { path: configTemplate.current_no.path, value: String(nextCounterIncrement) },
                current_prefix: { path: configTemplate.current_prefix.path, value: result },
              }
            }
            await configDataService.saveRunningNumberConfig(updateData, '')
          }

          const padding = configMap.counter_padding - nextCounterIncrement.toString().length
          for (let i = 0; i < padding; i++) {
            result += '0'
          }
          result += nextCounterIncrement

          break;
        }
        default:
          result += format
          break;
      }
    }

    return new StepResponse({
      generatedNo: result
    })
  }
);

export default generateStep;
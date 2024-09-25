import {
  initialConfigTemplate,
  RunningNumberConfigTemplate,
  RunningNumberConfigType
} from '../types/running-number-config'
import { ConfigDataPath } from '../types/config-data'

export const getInitialConfigTemplateByType = (type: RunningNumberConfigType): RunningNumberConfigTemplate => {
  if (type === RunningNumberConfigType.ORDER_NO) {
    return { ...initialConfigTemplate }
  }

  switch (type) {
    case RunningNumberConfigType.INVOICE_NO:
      return {
        is_enable: {
          path: ConfigDataPath.RUNNING_NUMBER_INVOICE_ISENABLE,
          value: '0'
        },
        format: {
          path: ConfigDataPath.RUNNING_NUMBER_INVOICE_FORMAT,
          value: '{yy}{mm}{dd}{counter}'
        },
        counter_increment: {
          path: ConfigDataPath.RUNNING_NUMBER_INVOICE_COUNTER_INCREMENT,
          value: '1'
        },
        counter_padding: {
          path: ConfigDataPath.RUNNING_NUMBER_INVOICE_COUNTER_PADDING,
          value: '4'
        },
        current_no: {
          path: ConfigDataPath.RUNNING_NUMBER_INVOICE_CURRENT_NO,
          value: '0'
        },
        current_prefix: {
          path: ConfigDataPath.RUNNING_NUMBER_INVOICE_CURRENT_PREFIX,
          value: ''
        }
      }

    default:
      return { ...initialConfigTemplate }
  }
}
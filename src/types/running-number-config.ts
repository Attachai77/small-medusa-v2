import { type ConfigData, ConfigDataPath } from "./config-data"

export type RunningNumberConfigTemplate = {
  is_enable?: ConfigData
  format?: ConfigData
  counter_increment?: ConfigData
  counter_padding?: ConfigData
  current_no?: ConfigData
  current_prefix?: ConfigData
}

export type RunningNumberConfigForm = {
  order?: RunningNumberConfigTemplate,
  invoice?: RunningNumberConfigTemplate,
  shipping?: RunningNumberConfigTemplate,
  credit_memo?: RunningNumberConfigTemplate
}

export enum RunningNumberConfigType { 
  ORDER_NO = 'order',
  INVOICE_NO = 'invoice',
  SHIPPING_NO = 'shipping',
  CREDIT_MEMO_NO = 'credit_memo'
}

export type RunningNumberConfigMap = {
  is_enable?: boolean
  format?: string
  counter_increment?: number
  counter_padding?: number
  current_no?: number
  current_prefix?: string
}

export const initialConfigTemplate: RunningNumberConfigTemplate = {
  is_enable: {
    path: ConfigDataPath.RUNNING_NUMBER_ORDER_ISENABLE,
    value: '0'
  },
  format: {
    path: ConfigDataPath.RUNNING_NUMBER_ORDER_FORMAT,
    value: '{yy}{mm}{dd}{counter}'
  },
  counter_increment: {
    path: ConfigDataPath.RUNNING_NUMBER_ORDER_COUNTER_INCREMENT,
    value: '1'
  },
  counter_padding: {
    path: ConfigDataPath.RUNNING_NUMBER_ORDER_COUNTER_PADDING,
    value: '4'
  },
  current_no: {
    path: ConfigDataPath.RUNNING_NUMBER_ORDER_CURRENT_NO,
    value: '0'
  },
  current_prefix: {
    path: ConfigDataPath.RUNNING_NUMBER_ORDER_CURRENT_PREFIX,
    value: ''
  }
}
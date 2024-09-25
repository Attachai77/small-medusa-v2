export type ConfigData = {
  id?: string
  path: string
  value: string
  created_by?: string
  updated_by?: string
  created_at?: string
  updated_at?: string
}

export enum ConfigDataPath {
  CANCEL_ORDER_GENERAL_ENABLED = 'cancel_order/general/enabled',
  CANCEL_ORDER_GENERAL_CONDITION = 'cancel_order/general/condition',
  ZORTOUT_GENERAL_ENABLED = 'zortout/general/enabled',
  ZORTOUT_GENERAL_WAREHOUSE = 'zortout/general/warehouse',
  ZORTOUT_GENERAL_TEST_EMAIL = 'zortout/general/test_email',
  RUNNING_NUMBER_ORDER_ISENABLE = 'running_number/order/is_enable',
  RUNNING_NUMBER_ORDER_FORMAT = 'running_number/order/format',
  RUNNING_NUMBER_ORDER_COUNTER_INCREMENT = 'running_number/order/counter_increment',
  RUNNING_NUMBER_ORDER_COUNTER_PADDING = 'running_number/order/counter_padding',
  RUNNING_NUMBER_ORDER_CURRENT_NO = 'running_number/order/current_no',
  RUNNING_NUMBER_ORDER_CURRENT_PREFIX = 'running_number/order/current_prefix',
  RUNNING_NUMBER_INVOICE_ISENABLE = 'running_number/invoice/is_enable',
  RUNNING_NUMBER_INVOICE_FORMAT = 'running_number/invoice/format',
  RUNNING_NUMBER_INVOICE_COUNTER_INCREMENT = 'running_number/invoice/counter_increment',
  RUNNING_NUMBER_INVOICE_COUNTER_PADDING = 'running_number/invoice/counter_padding',
  RUNNING_NUMBER_INVOICE_CURRENT_NO = 'running_number/invoice/current_no',
  RUNNING_NUMBER_INVOICE_CURRENT_PREFIX = 'running_number/invoice/current_prefix',
  RUNNING_NUMBER_SHIPPING_ISENABLE = 'running_number/shipping/is_enable',
  RUNNING_NUMBER_SHIPPING_FORMAT = 'running_number/shipping/format',
  RUNNING_NUMBER_SHIPPING_COUNTER_INCREMENT = 'running_number/shipping/counter_increment',
  RUNNING_NUMBER_SHIPPING_COUNTER_PADDING = 'running_number/shipping/counter_padding',
  RUNNING_NUMBER_SHIPPING_CURRENT_NO = 'running_number/shipping/current_no',
  RUNNING_NUMBER_SHIPPING_CURRENT_PREFIX = 'running_number/shipping/current_prefix',
  RUNNING_NUMBER_CREDIT_MEMO_ISENABLE = 'running_number/credit_memo/is_enable',
  RUNNING_NUMBER_CREDIT_MEMO_FORMAT = 'running_number/credit_memo/format',
  RUNNING_NUMBER_CREDIT_MEMO_COUNTER_INCREMENT = 'running_number/credit_memo/counter_increment',
  RUNNING_NUMBER_CREDIT_MEMO_COUNTER_PADDING = 'running_number/credit_memo/counter_padding',
  RUNNING_NUMBER_CREDIT_MEMO_CURRENT_NO = 'running_number/credit_memo/current_no',
  RUNNING_NUMBER_CREDIT_MEMO_CURRENT_PREFIX = 'running_number/credit_memo/current_prefix',
  TOP_SEARCH_GENERAL_ENABLED = 'top-search/general/enabled',
  TOP_SEARCH_GENERAL_DISPLAY_MODE = 'top-search/general/display_mode',
}
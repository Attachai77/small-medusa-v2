import { MedusaService } from '@medusajs/utils'
import type { Logger } from '@medusajs/medusa'
import OrderCustom from './models/order-custom'
import { Order } from '@medusajs/order/dist/models'


export default class OrderCustomModuleService extends MedusaService({
  OrderCustom,
  Order
}) {
  private logger: Logger

  async foo() {
    this.logger.info('foo')
    return 'foo'
  }

}
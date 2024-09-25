import { AdminLog } from './models/admin-logs'
import { MedusaService } from '@medusajs/utils'

interface CreateAdminLog {
  action: string
  actor_id: string
  resource_id?: string
  resource_type?: string
  metadata?: Record<string, any>
}

interface AddLog {
  path: string
  method: string
  actor_id: string
}

class AdminModuleService extends MedusaService({
  AdminLog,
}) {

  constructor() {
    super(...arguments)
  }

  addAdminLog(data: AddLog) {
    const log = this.prepareAddAdminLog(data)
    if(!log) return Promise.resolve()

    return this.createAdminLogs(log)
  }

  prepareAddAdminLog(data: AddLog) {
    const isProduct = data.path.includes('/admin/products')
    if(isProduct){
      const separator = data.path.split('/')
      const productId = separator[3]
      const action = data.method === 'DELETE' ?
          'delete-product' :
        productId ?
          'update-product' :
          'create-product'
      return {
        action,
        actor_id: data.actor_id,
        resource_id: productId,
        resource_type: 'product',
      }
    }

    return null
  }
}

export default AdminModuleService

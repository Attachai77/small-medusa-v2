import type { AuthContext, MedusaNextFunction, MedusaRequest, MedusaResponse } from '@medusajs/medusa'
import type AdminModuleService from '../modules/admin/service'

export const adminLogsMiddleware = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const path = req.baseUrl
  const method = req.method
  if(path === "/admin/notifications") {
    return next()
  }

  const admin = req.session['auth_context'] as AuthContext;
  if(!admin || !admin.actor_id) {
    return next()
  }

  if(method === "GET") {
    return next()
  }

  const adminModuleService: AdminModuleService = req.scope.resolve("adminModuleService")
  adminModuleService.addAdminLog({
    path,
    method,
    actor_id: admin.actor_id,
  })
    .then(() => {
      console.log('log added')
    })
    .catch((err) => {})


  next()
}
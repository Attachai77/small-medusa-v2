import type { AuthContext, MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import type { ICustomerModuleService, IAuthModuleService, AuthenticationInput, CustomerDTO, INotificationModuleService } from "@medusajs/types";
import { Modules, generateJwtToken } from "@medusajs/utils";
import type { Logger } from '@medusajs/medusa'

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const logger: Logger = req.scope.resolve('logger')
  try {
    let customer: CustomerDTO = null
    const customerModuleService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER)
    const authModuleService: IAuthModuleService = req.scope.resolve(Modules.AUTH)
    const authIdentityProviderService: IAuthModuleService = req.scope.resolve(Modules.AUTH)
    const notificationModuleService: INotificationModuleService = req.scope.resolve(Modules.NOTIFICATION)
    const authIdentity =
      await authModuleService.validateCallback("google", {
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        protocol: req.protocol,
      } as AuthenticationInput)
    const _provider_identity = authIdentity.authIdentity.provider_identities.filter((identity) => identity.auth_identity_id === authIdentity.authIdentity.id)
    const provider_identity = _provider_identity.length > 0 ? _provider_identity[0] : null
    const customers = await customerModuleService.listCustomers({
      email: [ provider_identity.entity_id ]
    })
    if (customers.length === 0) {
      const create = await customerModuleService.createCustomers({
        email: provider_identity.entity_id ?? '',
        first_name: provider_identity.user_metadata.given_name.toString() ?? '',
        last_name: provider_identity.user_metadata.family_name.toString() ?? '',
        has_account: true,
        metadata: provider_identity.user_metadata
      })
      customer = create
      await notificationModuleService.createNotifications({
        to: customer.email,
        channel: "email",
        template: process.env.SENDGRID_CUSTOMER_CREATED,
        data:{
          first_name: customer.first_name,
          landing_page_url: process.env.MEDUSA_FRONTEND_URL,
        },
      })
    } else {
      customer = customers[0]
      await customerModuleService.updateCustomers(customer.id, {
        metadata: provider_identity.user_metadata
      })
    }
    await authIdentityProviderService.updateAuthIdentities([ {
      id: authIdentity.authIdentity.id,
      app_metadata: {
        customer_id: customer.id
      }
    } ])
    const payload = {
      actor_id: customer.id,
      actor_type: "customer",
      auth_identity_id: authIdentity.authIdentity.id,
      app_metadata: {
        customer_id: customer.id
      }
    };
    const customerToken = generateJwtToken(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "3600s"
    })
    res.json({
      token: customerToken,
    })
  } catch (error) {
    logger.error("callbacks google-auth error", JSON.stringify(error))
    res.json({
      token: null,
      message: error.message
    })
  }
}
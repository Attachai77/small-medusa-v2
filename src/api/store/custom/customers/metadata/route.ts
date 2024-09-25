import { MedusaResponse } from '@medusajs/medusa'
import jwt from 'jsonwebtoken'
import { IAuthModuleService, ICustomerModuleService, INotificationModuleService } from '@medusajs/types'
import { Modules } from '@medusajs/utils'
import { IsBoolean, IsOptional } from 'class-validator'
import { _validate } from '../../../../validator'
import { MedusaRequestWithAuth } from '../../../../../types/common'

class CustomerMetadataDto {
  @IsBoolean()
  @IsOptional()
  is_receive_newsletter: string;

  @IsBoolean()
  @IsOptional()
  is_accept_conditions: string;
}

export const POST = async (req: MedusaRequestWithAuth, res: MedusaResponse) => {
  try {
    await _validate(req, res, CustomerMetadataDto);
    if (res.statusCode === 400) return

    const notificationModuleService: INotificationModuleService = req.scope.resolve(Modules.NOTIFICATION)
    const authModuleService: IAuthModuleService = req.scope.resolve(Modules.AUTH);
    const customerModuleService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER);
    const token = req.header('Authorization')?.split('Bearer ')[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET) as { auth_identity_id: string };
    const auth_identity_id = verifiedToken?.auth_identity_id;

    let actor_id = req.auth_context?.actor_id;
    if (!auth_identity_id && !actor_id) {
      res.status(401).json({
        message: 'Unauthorized'
      })
      return
    }

    if (!actor_id) {
      const authIdentity = await authModuleService.retrieveAuthIdentity(auth_identity_id);
      actor_id = authIdentity?.app_metadata?.customer_id as string;
    }

    if (!actor_id) {
      res.status(401).json({
        message: 'Unauthorized'
      })
      return
    }

    const updateMetadata = req.body as Record<string, any>
    const customer = await customerModuleService.updateCustomers(actor_id, {
      metadata: updateMetadata
    })
    await notificationModuleService.createNotifications({
      to: customer.email,
      channel: "email",
      template: process.env.SENDGRID_CUSTOMER_CREATED,
      data:{
        first_name: customer.first_name,
        landing_page_url: process.env.MEDUSA_FRONTEND_URL,
      },
    })

    if (customer.metadata.is_receive_newsletter) {
      setTimeout(async () => {
        await notificationModuleService.createNotifications({
          to: customer.email,
          channel: "email",
          template: process.env.SENDGRID_SUBSCRIBE_NEWSLETTER,
          data:{
            first_name: customer.first_name,
            landing_page_url: process.env.MEDUSA_FRONTEND_URL,
          },
        })
      }, 5000)
    }

    return res.json({
      customer,
    })
  } catch (e) {
    return res.status(500).json({
      message: e.message || 'An error occurred'
    })
  }
}
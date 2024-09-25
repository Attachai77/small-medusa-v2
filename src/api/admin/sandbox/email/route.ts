import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { Modules } from '@medusajs/utils'
import { INotificationModuleService } from "@medusajs/types"

interface ISendEmail {
  email: string;
}

export async function POST(req: MedusaRequest<ISendEmail>, res: MedusaResponse) {
  const notificationModuleService: INotificationModuleService =
    req.scope.resolve(Modules.NOTIFICATION)
  const email = req.body.email
  if (!email) {
    res.status(400).json({
      message: "Email is required",
    });
    return
  }

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: "d-ea3e3e4d33c3492fa3f43036d969b41e",
    data: {
      foo: "test data",
    },
  })

  res.json({
    message: `Email sent to ${email}`,
  });
}
import { defineMiddlewares } from "@medusajs/medusa"
import { adminLogsMiddleware } from '../middlewares'

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [adminLogsMiddleware],
    },
  ],
})
import type { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import jwt, { type JwtPayload } from "jsonwebtoken"
import type { IUserModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
) {
  const logger: Logger = req.scope.resolve('logger')
  const userModuleService: IUserModuleService = req.scope.resolve(
    Modules.USER
  )

  const token = req.header('Authorization')?.split(' ')[1]
  logger.info(`Retrieving callback auth from strapi, token: ${token}`)

  if (!token) {
    logger.error('No token provided')
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Verify token
  const jwtSecret = process.env.JWT_SECRET
  try {
    const decoded: JwtPayload = jwt.verify(token, jwtSecret, { complete: true })
    const userId = decoded?.payload?.user_id as string
    if (!userId) {
      logger.error('No user_id in token')
      return res.status(401).json({ message: 'Unauthorized', error: 'No user_id in token' })
    }
    logger.info(`User id retrieved: ${userId}`)

    const user = await userModuleService.retrieveUser(userId)
    logger.info(`User retrieved: ${user.email}`)

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error: error?.message })
  }
}
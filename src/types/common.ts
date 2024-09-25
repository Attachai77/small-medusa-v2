import { type AuthContext, MedusaRequest } from '@medusajs/medusa'

export interface MedusaRequestWithAuth extends MedusaRequest {
  auth_context: AuthContext;
}
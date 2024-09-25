import { validate } from 'class-validator';
import { MedusaResponse } from '@medusajs/medusa'
import { MedusaRequestWithAuth } from '../types/common'

export const _validate = async (
  req: MedusaRequestWithAuth,
  res: MedusaResponse,
  ValidateClass: any
) => {
  const body = req.body;
  let validateClass = new ValidateClass();
  Object.assign(validateClass, body);
  const errors = await validate(validateClass, {
    whitelist: true,
  });

  req.body = validateClass;

  if (errors.length > 0) {
    const _errors = errors.map(error => ({
        field: error.property,
        messages: Object.values(error.constraints)?.[0] || 'Invalid value'
      })
    );

    res.status(400).json({
      message: 'Validation error',
      errors: _errors
    });
    return;
  }
}
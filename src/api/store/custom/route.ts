import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import getProductDetailWorkflow from '../../../workflows/get-products-detail'

export async function GET(
	req: MedusaRequest,
	res: MedusaResponse,
): Promise<void> {
	const { result } = await getProductDetailWorkflow(req.scope).run({
		input: {
			productIds: ['prod_01J4H55QXW6HNCE7B8TBR9Q36F']
		}
	})

	res.json({
		product: result
	})
	// res.sendStatus(200);
}

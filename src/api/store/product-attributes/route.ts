import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type ProductAttributeService from "../../../modules/product-attributes/service";
import type { ProductAttribute } from "../../../types/attribute";

interface AttributeQuery extends Partial<ProductAttribute> {
    limit?: number;
}

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    const productAttributeService: ProductAttributeService =
        req.scope.resolve("productAttributeModuleService");

    const queryFields = { ...req.query, status: true } as Partial<AttributeQuery>;

    const { limit, ...filteredQueryFields } = queryFields;



    try {
        const attributes = await productAttributeService.listAllAttributesWithOptions(filteredQueryFields, limit );
        res.json({ attributes });
    } catch (error) {
        console.error("Error fetching attributes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
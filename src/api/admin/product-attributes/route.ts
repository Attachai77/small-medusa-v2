import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type ProductAttributeService from "../../../modules/product-attributes/service";
import type { ProductAttribute, ProductAttributeType } from "../../../types/attribute";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    const productAttributeService: ProductAttributeService =
        req.scope.resolve("productAttributeModuleService");

    const queryFields = req.query as Partial<ProductAttribute>;

    try {
        const attributes = await productAttributeService.listAllAttributesWithOptions(queryFields);
        res.json({ attributes });
    } catch (error) {
        console.error("Error fetching attributes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    try {
        const { title, code, description, type, is_filterable, is_required, is_unique, status, rank } = req.body as Omit<ProductAttribute, 'type'> & { type: string };

        const productAttributeService: ProductAttributeService =
            req.scope.resolve("productAttributeModuleService");

        const newAttribute = await productAttributeService.createAttribute({
            title,
            code,
            description,
            type: type as ProductAttributeType,
            is_filterable,
            is_required,
            is_unique,
            status,
            metadata: {},
            rank,
        });

        res.status(201).json({ attribute: newAttribute });
    } catch (error) {
        console.error("Error creating attribute:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type ProductAttributeService from "../../../../modules/product-attributes/service";
import type { ProductAttribute, ProductAttributeType } from "../../../../types/attribute";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    const productAttributeService: ProductAttributeService =
        req.scope.resolve("productAttributeModuleService");

    const { id } = req.params;
    try {
        const attributes = await productAttributeService.getAttributeById(id);
        res.json({ attributes });
    } catch (error) {
        console.error("Error fetching attributes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function PUT(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    const productAttributeService: ProductAttributeService =
        req.scope.resolve("productAttributeModuleService");

    const { id } = req.params;
    const updateData: Partial<ProductAttribute> = req.body;

    try {
        const updatedAttribute = await productAttributeService.updateProductAttributes({
            id,
            ...updateData
        });
        res.json({ attribute: updatedAttribute });
    } catch (error) {
        console.error("Error updating attribute:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse,
): Promise<void> {
    const { id } = req.params;
    const productAttributeService: ProductAttributeService =
        req.scope.resolve("productAttributeModuleService");

    try {
        await productAttributeService.deleteAttributeById(id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting attribute:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
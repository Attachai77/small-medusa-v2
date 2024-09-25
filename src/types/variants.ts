import type { ProductVariantDTO as MedusaProductVariantDTO, ProductImageDTO } from "@medusajs/types"

export interface Image extends ProductImageDTO {
  variant_id: string;
};

export interface ProductVariantDTO extends MedusaProductVariantDTO {
  images: Image[];
};

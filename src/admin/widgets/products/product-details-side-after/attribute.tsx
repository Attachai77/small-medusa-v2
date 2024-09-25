import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui";
import { useEffect, useState, useCallback } from "react";
import type { ProductAttribute } from "../../../../types/attribute";
import { SectionRow } from "@medusajs/dashboard/src/components/common/section";
import { useParams } from "react-router-dom";
import { ActionMenu } from "@medusajs/dashboard/src/components/common/action-menu";
import { PencilSquare } from "@medusajs/icons";
import { useTranslation } from "react-i18next";

const ProductAttributeWidget = () => {
  const { t } = useTranslation();
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  const fetchProductAttributes = useCallback(async () => {
    try {
      const response = await fetch("/admin/product-attributes?status=true", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product attributes");
      }
      const attributesData = await response.json();
      return attributesData.attributes || [];
    } catch (err) {
      setError("Error fetching product attributes. Please try again.");
      console.error("Error fetching product attributes:", err);
      return [];
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`/admin/products/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const productData = await response.json();
      const productAttributes = await fetchProductAttributes();

      const mappedAttributes = productAttributes.reduce(
        (acc: Record<string, string>, attribute: ProductAttribute) => {
          const attributeValue =
            productData?.product?.metadata?.[attribute.code] || "";
          const valuesArray = attributeValue.includes(",")
            ? attributeValue.split(",")
            : [attributeValue];
          const optionTitles = valuesArray.map(
            (value: string) =>
              attribute.options?.find((option) => option.value === value.trim())
                ?.title || value.trim()
          );
          acc[attribute.title] =
            optionTitles.length > 0 ? optionTitles.join(", ") : attributeValue;
          return acc;
        },
        {}
      );

      setAttributes(mappedAttributes);
    } catch (err) {
      setError("Error fetching product metadata. Please try again.");
      console.error("Error fetching product metadata:", err);
    } finally {
      setLoading(false);
    }
  }, [id, fetchProductAttributes]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text className="text-red-500">{error}</Text>;

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Custom Attributes</Heading>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "custom-attributes",
                    icon: <PencilSquare />,
                  },
                ],
              },
            ]}
          />
        </div>

        {Object.entries(attributes).length > 0 ? (
          Object.entries(attributes).map(([key, attribute]) => (
            <SectionRow
              key={key}
              title={key}
              value={String(attribute) || "-"}
            />
          ))
        ) : (
          <Text className="px-6 py-4">No custom attributes available.</Text>
        )}
      </Container>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductAttributeWidget;

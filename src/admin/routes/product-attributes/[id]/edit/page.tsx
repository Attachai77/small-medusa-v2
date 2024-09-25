import { Container, Heading, Text } from "@medusajs/ui";
import { AttributeForm } from "../../components/attribute-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type {
  ProductAttribute,
  ProductEditAttribute,
} from "../../../../../types/attribute";

const AttributeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attribute, setAttribute] = useState<ProductEditAttribute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const response = await fetch(`/admin/product-attributes/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch attribute");
        }
        const data = await response.json();
        setAttribute(data);
      } catch (err) {
        setError("Error fetching attribute. Please try again.");
        console.error("Error fetching attribute:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttribute();
  }, [id]);

  const handleSubmit = async (data: ProductAttribute) => {
    try {
      const response = await fetch(`/admin/product-attributes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate("/product-attributes");
      } else {
        setError("Failed to update attribute. Please try again.");
      }
    } catch (error) {
      console.error("Error updating attribute:", error);
      setError("An error occurred while updating the attribute.");
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text className="text-red-500">{error}</Text>;
  if (!attribute) return <Text>Attribute not found</Text>;

  return (
    <Container className="divide-y px-6">
      <Heading level="h1" className="mb-4">
        {attribute?.attributes?.[0]?.title}
      </Heading>
      <AttributeForm
        initialData={attribute}
        onSubmit={handleSubmit}
        isEditMode={true}
      />
    </Container>
  );
};

export default AttributeEditPage;

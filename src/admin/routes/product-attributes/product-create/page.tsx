import { Container, Heading, Text } from "@medusajs/ui";
import { useTranslation } from "react-i18next";
import { AttributeForm } from "../components/attribute-form";
import { useNavigate } from "react-router-dom";
import type { ProductAttribute } from "../../../../types/attribute";

const AttributeCreatePage = ({
  setIsCreateModalOpen,
  setLoading,
}: {
  setIsCreateModalOpen: (isCreateModalOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductAttribute) => {
    try {
      const response = await fetch("/admin/product-attributes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setLoading(true);
        navigate("/product-attributes");
      } else {
        throw new Error("Failed to create attribute");
      }
    } catch (error) {
      console.error("Error creating attribute:", error);
    }
  };

  return (
    <>
      <Container className="px-6 p-0">
        <div className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-[720px]  flex-col">
            <div>
              <Heading level="h1" className="mb-0">
                {t("Create New Attribute")}
              </Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Create a new attribute to categorize and describe your products.
              </Text>
            </div>
            <AttributeForm
              onSubmit={handleSubmit}
              isEditMode={false}
              setIsCreateModalOpen={setIsCreateModalOpen}
              setLoading={setLoading}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default AttributeCreatePage;

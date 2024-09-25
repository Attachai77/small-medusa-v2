import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Heading, toast, Checkbox } from "@medusajs/ui";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Form } from "@medusajs/dashboard/src/components/common/form";
import { RouteDrawer } from "@medusajs/dashboard/src/components/route-modal";
import type { ProductAttribute } from "../../../../../types/attribute";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Combobox } from "@medusajs/dashboard/src/components/inputs/combobox";

const CustomAttributeSchema = z.object({
  attributes: z.array(
    z.object({
      id: z.string().optional(),
      code: z.string().optional(),
      title: z.string().optional(),
      value: z.string().optional().or(z.array(z.string())),
    })
  ),
});

type CustomAttributeFormValues = z.infer<typeof CustomAttributeSchema>;

const EditCustomAttributesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [existingMetadata, setExistingMetadata] = useState({});

  const methods = useForm<CustomAttributeFormValues>({
    defaultValues: {
      attributes: [],
    },
    resolver: zodResolver(CustomAttributeSchema),
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: "attributes",
  });

  const fetchAttributes = useCallback(async () => {
    try {
      const response = await fetch("/admin/product-attributes?status=true", {
        credentials: "include",
      });
      const data = await response.json();
      setAttributes(data.attributes);
      methods.reset({
        attributes: data.attributes.map((attr) => ({
          id: attr.id,
          code: attr.code,
          title: attr.title,
          value: "",
        })),
      });
    } catch (error) {
      console.error("Error fetching attributes:", error);
      setAttributes([]);
    }
  }, [methods]);

  const fetchProductMetadata = useCallback(async () => {
    try {
      const response = await fetch(`/admin/products/${id}`, {
        credentials: "include",
      });
      const productData = await response.json();
      const metadata = productData.product.metadata || {};
      setExistingMetadata(metadata);
      methods.reset({
        attributes: attributes.map((attr) => ({
          ...attr,
          value: attr.type === "multiselect" 
            ? (metadata[attr.code] ? metadata[attr.code].split(', ') : [])
            : metadata[attr.code] || "",
        })),
      });
    } catch (error) {
      console.error("Error fetching product metadata:", error);
    }
  }, [id, attributes, methods]);

  useEffect(() => {
    fetchAttributes();
  }, [fetchAttributes]);

  useEffect(() => {
    if (attributes.length > 0) {
      fetchProductMetadata();
    }
  }, [attributes, fetchProductMetadata]);

  const onSubmit = methods.handleSubmit(async (values) => {

    try {
      const updatedMetadata = {
        ...existingMetadata,
        ...values.attributes.reduce((acc, attr) => {
          if (attr.value !== undefined) {
            acc[attr.code] = Array.isArray(attr.value) 
              ? attr.value.join(', ') 
              : attr.value;
          }
          return acc;
        }, {}),
      };
   
      const response = await fetch(`/admin/products/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          metadata: updatedMetadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update product metadata: ${JSON.stringify(errorData)}`
        );
      }

      const updatedProduct = await response.json();
      methods.reset({
        attributes: updatedProduct.metadata,
      });
      toast.success("Product updated successfully");
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Error updating product metadata:", error);
      toast.error("Failed to update product metadata"); 
    }
  });

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>Edit Custom Attributes</Heading>
      </RouteDrawer.Header>
      <FormProvider {...methods}>
        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
            {fields.map((field, index) => (
              <Form.Field
                key={field.id}
                control={methods.control}
                name={`attributes.${index}.value`}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{attributes[index]?.title}</Form.Label>
                    <Form.Control>
                      {attributes[index]?.type === "text" ? (
                        <Input {...field} />
                      ) : attributes[index]?.type === "select" ||
                        attributes[index]?.type === "swatch_visual" ? (
                        <Select
                          {...field}
                          value={Array.isArray(field.value) ? field.value[0] || null : field.value}
                          onValueChange={(newValue) => field.onChange(newValue)}
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Select an option" />
                          </Select.Trigger>
                          <Select.Content>
                          <Select.Item value={null}>
                              <span>No selection</span>
                            </Select.Item>
                            {attributes[index]?.options?.map((option) => (
                              <Select.Item
                                key={option.value}
                                value={option.value}
                              >
                                {option.title}
                              </Select.Item>
                            ))}
                            
                          </Select.Content>
                        </Select>
                      ) : attributes[index]?.type === "multiselect" ? (
                       
                        <Combobox
                          value={Array.isArray(field.value) && field.value.length > 0 ? field.value : []}
                          onChange={(newValue) => field.onChange(newValue)}
                          options={attributes[index]?.options?.map((option) => ({
                            value: option.value,
                            label: option.title,
                          })) || []}
                          placeholder="Select options"
                        />
                      ) : null}
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            ))}
          </RouteDrawer.Body>
          <RouteDrawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <RouteDrawer.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteDrawer.Close>
              <Button type="submit" size="small">
                {t("actions.save")}
              </Button>
            </div>
          </RouteDrawer.Footer>
        </form>
      </FormProvider>
    </RouteDrawer>
  );
};

export default EditCustomAttributesForm;

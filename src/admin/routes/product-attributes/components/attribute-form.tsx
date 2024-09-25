import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, toast, Textarea, Select, Switch } from "@medusajs/ui";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Form } from "@medusajs/dashboard/src/components/common/form";
import type {
  ProductAttribute,
  ProductEditAttribute,
} from "../../../../types/attribute";
import { PencilSquare } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";

const AttributeSchema = z.object({
  title: z.string().min(1),
  code: z
    .string()
    .min(1)
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Code must contain only lowercase letters, numbers, and underscores",
    }),
  description: z.string().optional(),
  type: z.enum(["text", "multiselect", "select", "swatch_visual"]),
  is_filterable: z.boolean(),
  is_required: z.boolean(),
  is_unique: z.boolean(),
  status: z.boolean(),
  rank: z.number().min(0),
  metadata: z.record(z.string()).optional(),
});

const attributeTypes = [
  { value: "text", label: "Text" },
  { value: "multiselect", label: "Multi select" },
  { value: "select", label: "Select" },
  { value: "swatch_visual", label: "Visual Swatch" },
];

interface AttributeFormProps {
  initialData?: ProductEditAttribute;
  onSubmit: (data: ProductAttribute) => Promise<void>;
  isEditMode: boolean;
  setIsCreateModalOpen?: (isCreateModalOpen: boolean) => void;
  setLoading?: (loading: boolean) => void;
}

export const AttributeForm = ({
  initialData,
  onSubmit,
  isEditMode,
  setIsCreateModalOpen,
  setLoading,
}: AttributeFormProps) => {
  const { t } = useTranslation();
  const [isCodeEditable, setIsCodeEditable] = useState(false);
  const navigate = useNavigate();
  const defaultValues =
    isEditMode && initialData?.attributes[0]
      ? {
          title: initialData.attributes[0].title,
          code: initialData.attributes[0].code,
          description: initialData.attributes[0].description,
          type: initialData.attributes[0].type,
          is_filterable: initialData.attributes[0].is_filterable,
          is_required: initialData.attributes[0].is_required,
          is_unique: initialData.attributes[0].is_unique,
          status: initialData.attributes[0].status,
          rank: initialData.attributes[0].rank,
          metadata: initialData.attributes[0].metadata,
        }
      : {
          title: "",
          code: "",
          description: "",
          type: "text" as const,
          is_filterable: false,
          is_required: false,
          is_unique: false,
          status: true,
          rank: 0,
          metadata: {},
        };

  const methods = useForm<ProductAttribute>({
    defaultValues,
    resolver: zodResolver(AttributeSchema),
  });

  useEffect(() => {
    if (!isEditMode) {
      const subscription = methods.watch((value, { name }) => {
        if (name === "title" && !isCodeEditable) {
          const code = value.title
            ?.toLowerCase()
            .replace(/[^a-z0-9_\s]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "_");
          methods.setValue("code", code ?? "");
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [methods, isCodeEditable, isEditMode]);

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (!isEditMode) {
      setLoading(true);
    }
    try {
      await onSubmit(data);
      toast.success(
        isEditMode
          ? "Attribute updated successfully"
          : "Attribute created successfully"
      );
      if (!isEditMode) {
        setIsCreateModalOpen(false);
        setLoading(true);
      }
      navigate("/product-attributes");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} attribute:`,
        error
      );
      toast.error(
        `An error occurred while ${
          isEditMode ? "updating" : "creating"
        } the attribute`
      );
    } finally {
      if (!isEditMode) {
        setLoading(false);
      }
    }
  });

  const watchType = methods.watch("type");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="py-6">
        <div className="flex w-full max-w-[720px] flex-col gap-y-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Field
              control={methods.control}
              name="title"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>{t("fields.title")}</Form.Label>
                  <Form.Control>
                    <Input autoComplete="off" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    Give your attribute a short and clear title.
                  </Form.Hint>
                </Form.Item>
              )}
            />
            <Form.Field
              control={methods.control}
              name="code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Code</Form.Label>
                  <div className="flex justify-between [&_div.relative]:grow">
                    <Form.Control className="grow">
                      <Input
                        readOnly={isEditMode || !isCodeEditable}
                        disabled={isEditMode}
                        autoComplete="off"
                        className={`${
                          isCodeEditable ? "opacity-100" : "opacity-50"
                        }`}
                        {...field}
                      />
                    </Form.Control>
                    {!isEditMode && (
                      <Button
                        variant={isCodeEditable ? "primary" : "secondary"}
                        size="small"
                        type="button"
                        className="ml-2"
                        onClick={() => setIsCodeEditable(!isCodeEditable)}
                      >
                        <PencilSquare />
                      </Button>
                    )}
                  </div>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    {isEditMode
                      ? "The code of the attribute. This cannot be changed."
                      : "The code of the attribute. Click the edit icon to modify."}
                  </Form.Hint>
                </Form.Item>
              )}
            />
            <Form.Field
              control={methods.control}
              name="description"
              render={({ field }) => (
                <Form.Item className="md:col-span-2">
                  <Form.Label optional>{t("fields.description")}</Form.Label>
                  <Form.Control>
                    <Textarea autoComplete="off" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    Give your attribute a short and clear description.
                  </Form.Hint>
                </Form.Item>
              )}
            />
            <Form.Field
              control={methods.control}
              name="type"
              render={({ field: { onChange, value, ...rest } }) => (
                <Form.Item className="md:col-span-2">
                  <Form.Label>{t("fields.type")}</Form.Label>
                  <Form.Control>
                    <Select
                      value={value}
                      onValueChange={(newValue) => onChange(newValue)}
                      {...rest}
                      disabled={isEditMode}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select attribute type" />
                      </Select.Trigger>
                      <Select.Content>
                        {attributeTypes.map((item) => (
                          <Select.Item key={item.value} value={item.value}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    {isEditMode
                      ? "The type of attribute. This cannot be changed."
                      : "Select the type of attribute."}
                  </Form.Hint>
                </Form.Item>
              )}
            />
            <Form.Field
              control={methods.control}
              name="status"
              render={({ field: { value, onChange, ...field } }) => (
                <Form.Item>
                  <div className="flex items-start justify-between">
                    <Form.Label>Status</Form.Label>
                    <Form.Control>
                      <Switch
                        {...field}
                        checked={value}
                        onCheckedChange={onChange}
                      />
                    </Form.Control>
                  </div>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    Determine if this attribute is enabled or disabled.
                  </Form.Hint>
                </Form.Item>
              )}
            />
            {(watchType === "select" || watchType === "multiselect" || watchType === "swatch_visual") && (
              <Form.Field
                control={methods.control}
                name="is_filterable"
                render={({ field: { value, onChange, ...field } }) => (
                  <Form.Item>
                    <div className="flex items-start justify-between">
                      <Form.Label>Filterable</Form.Label>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.ErrorMessage />
                    <Form.Hint>
                      Determine if this attribute can be used for filtering
                      products.
                    </Form.Hint>
                  </Form.Item>
                )}
              />
            )}
            {/* <Form.Field
              control={methods.control}
              name="is_required"
              render={({ field: { value, onChange, ...field } }) => (
                <Form.Item>
                  <div className="flex items-start justify-between">
                    <Form.Label>Required</Form.Label>
                    <Form.Control>
                      <Switch
                        {...field}
                        checked={value}
                        onCheckedChange={onChange}
                      />
                    </Form.Control>
                  </div>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    Determine if this attribute is required for all products.
                  </Form.Hint>
                </Form.Item>
              )}
            /> */}
            {/* <Form.Field
              control={methods.control}
              name="is_unique"
              render={({ field: { value, onChange, ...field } }) => (
                <Form.Item>
                  <div className="flex items-start justify-between">
                    <Form.Label>Unique</Form.Label>
                    <Form.Control>
                      <Switch
                        {...field}
                        checked={value}
                        onCheckedChange={onChange}
                      />
                    </Form.Control>
                  </div>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    Determine if this attribute should have unique values across
                    products.
                  </Form.Hint>
                </Form.Item>
              )}
            /> */}
            <Form.Field
              control={methods.control}
              name="rank"
              render={({ field }) => (
                <Form.Item className="md:col-span-2">
                  <Form.Label>Rank</Form.Label>
                  <Form.Control>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value, 10))
                      }
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                  <Form.Hint>
                    Set the rank of this attribute. Lower rank attributes appear
                    first.
                  </Form.Hint>
                </Form.Item>
              )}
            />
          </div>
          <Button type="submit">
            {isEditMode ? "Update Attribute" : "Create Attribute"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

import {
  Container,
  Heading,
  Text,
  Button,
  Input,
  IconButton,
} from "@medusajs/ui";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import type {
  ProductAttribute,
  ProductEditAttribute,
  AttributeOption,
} from "../../../../../types/attribute";
import { Trash, XMarkMini } from "@medusajs/icons";
import { useTranslation } from "react-i18next";
import { ProductAttributeTypeEnum } from "../../../../../types/attribute";
import { z } from "zod";
import { FileUpload } from "@medusajs/dashboard/src/components/common/file-upload";
import type { FileType } from "@medusajs/dashboard/src/components/common/file-upload";
import { SortableList } from "@medusajs/dashboard/src/components/common/sortable-list";

type SortableAttributeOption = AttributeOption & { id: string };

const optionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.string().min(1, "Value is required"),
});

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
];

const ManageOptionsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [attribute, setAttribute] = useState<ProductEditAttribute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<SortableAttributeOption[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<(File | null)[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const fetchAttribute = useCallback(async (): Promise<void> => {
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
  }, [id]);

  const fetchOptions = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/admin/product-attributes/${id}/options`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }
      const data = await response.json();

      setOptions(
        data.options.map((option: AttributeOption) => ({
          ...option,
          id: option.id || `temp_${Date.now()}_${Math.random()}`,
        }))
      );
      setPreviewImages(
        data.options.map((option: AttributeOption) =>
          option.metadata?.image_url?.startsWith("http")
            ? option.metadata?.image_url
            : ""
        )
      );
    } catch (err) {
      setError("Error fetching options. Please try again.");
      console.error("Error fetching options:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchAttribute();
    fetchOptions();
  }, [fetchAttribute, fetchOptions]);

  const handleSubmit = async (data: ProductAttribute) => {
    try {
      const uploadPromises = uploadedFiles.map(async (file, index) => {
        if (!file) return { index, url: options[index]?.metadata?.image_url };

        const formData = new FormData();
        formData.append("files", file);

        const uploadResponse = await fetch("/admin/uploads", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload file ${file.name}`);
        }
        const uploadData = await uploadResponse.json();

        return { index, url: uploadData.files[0].url };
      });

      const uploadResults = await Promise.all(uploadPromises);

      const updatedOptions = options.map((option, index) => {
        const uploadResult = uploadResults.find(
          (result) => result?.index === index
        );
        const updatedOption = { ...option };
        if (attribute?.attributes?.[0]?.type === "swatch_visual") {
          updatedOption.metadata = {
            ...updatedOption.metadata,
            image_url: uploadResult?.url || option.metadata?.image_url,
          };
        }

        return option.id.startsWith("temp_")
          ? (({ id, ...rest }) => rest)(updatedOption)
          : updatedOption;
      });

      const response = await fetch(`/admin/product-attributes/${id}/options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...data, options: updatedOptions }),
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

  const handleAddOption = () => {
    setShowErrors(false);
    const newId = `temp_${Date.now()}_${Math.random()}`;
    setOptions((prevOptions) => [
      ...prevOptions,
      { id: newId, title: "", value: "", rank: prevOptions.length },
    ]);
    setPreviewImages((prevImages) => [...prevImages, ""]);
    setUploadedFiles((prevFiles) => [...prevFiles, null]);
  };

  const handleOptionChange = (
    index: number,
    field: "title" | "value",
    value: string
  ) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index][field] = value;
      return newOptions;
    });

    try {
      optionSchema.parse(options[index]);
      setValidationErrors((prev) => ({ ...prev, [`${index}.${field}`]: "" }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === field);
        if (fieldError) {
          setValidationErrors((prev) => ({
            ...prev,
            [`${index}.${field}`]: fieldError.message,
          }));
        }
      }
    }
  };

  const handleFileUpload = (index: number, files: FileType[]) => {
    if (files.length > 0) {
      setUploadedFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = files[0].file;
        return newFiles;
      });

      const previewURL = URL.createObjectURL(files[0].file);
      setPreviewImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = previewURL;
        return newImages;
      });
    }
  };

  const handleSubmitOptions = () => {
    setShowErrors(true);
    const validationResults = options.map((option, index) => {
      const isSwatchVisual = attribute?.attributes?.[0]?.type === "swatch_visual";
      const hasNoImage = !uploadedFiles[index] && !previewImages[index];
      if (isSwatchVisual && hasNoImage) {
        return {
          success: false,
          error: { issues: [{ path: ["value"], message: "Value is required" }] }
        };
      }
      return optionSchema.safeParse(option);
    });

    const isValid = validationResults.every(result => result.success);
    if (isValid) {
      const updatedOptions = options.map(option => option.id ? option : {
        title: option.title,
        value: option.value,
        rank: option.rank
      });

      void handleSubmit({
        ...attribute?.attributes?.[0],
        options: updatedOptions
      } as ProductAttribute);
    } else {
      const errors: Record<string, string> = {};

      validationResults.forEach((result, index) => {
        if (!result.success && "error" in result) {
          result.error.issues.forEach(issue => {
            errors[`${index}.${issue.path[0]}`] = issue.message;
          });
        }
      });

      setValidationErrors(errors);

      const firstErrorElement = optionsContainerRef.current?.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      return newOptions;
    });

    setPreviewImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

    setUploadedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${index}.title`];
      delete newErrors[`${index}.value`];
      return newErrors;
    });
  };

  const handleRankChange = (items: SortableAttributeOption[]) => {
    setShowErrors(false);
    const updatedOptions = items.map((item, index) => ({
      ...item,
      rank: index,
    }));
    setOptions(updatedOptions);
    setPreviewImages((prevImages) => {
      const newImages = [];
      for (const item of items) {
        const originalIndex = options.findIndex((opt) => opt.id === item.id);
        newImages.push(prevImages[originalIndex]);
      }
      return newImages;
    });
    setUploadedFiles((prevFiles) => {
      const newFiles = [];
      for (const item of items) {
        const originalIndex = options.findIndex((opt) => opt.id === item.id);
        newFiles.push(prevFiles[originalIndex]);
      }
      return newFiles;
    });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text className="text-red-500">{error}</Text>;
  if (!attribute) return <Text>Attribute not found</Text>;

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="divide-y p-0">
        <Heading level="h1" className="px-6 py-4">
          {attribute?.attributes?.[0]?.title}
        </Heading>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Status
          </Text>
          <Text
            size="small"
            leading="compact"
            className={
              attribute?.attributes?.[0]?.status
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {attribute?.attributes?.[0]?.status ? "Active" : "Inactive"}
          </Text>
        </div>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Title
          </Text>
          <Text size="small" leading="compact">
            {attribute?.attributes?.[0]?.title}
          </Text>
        </div>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Code
          </Text>
          <Text size="small" leading="compact">
            {attribute?.attributes?.[0]?.code}
          </Text>
        </div>
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Type
          </Text>
          <Text size="small" leading="compact">
            {ProductAttributeTypeEnum[attribute?.attributes?.[0]?.type]}
          </Text>
        </div>
      </Container>

      <Container className="p-0 divide-y">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h1">Manage Options</Heading>
          <Button size="small" variant="secondary" onClick={handleAddOption}>
            Add
          </Button>
        </div>
        <div className="divide-y">
          <div ref={optionsContainerRef} className="ml-auto mr-auto max-w-[1000px] flex flex-col gap-y-3 py-6">
            {options.length === 0 ? (
              <Text className="text-center">No options available</Text>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <div
                  className="bg-ui-bg-component text-ui-fg-subtle grid items-center gap-3 border-b px-6 py-3.5"
                  style={{ gridTemplateColumns: "28px 1fr 1fr 1fr auto" }}
                >
                  <div />
                  <Text
                    className="text-center"
                    size="small"
                    leading="compact"
                    weight="plus"
                  >
                    Title
                  </Text>
                  <Text
                    className="text-center"
                    size="small"
                    leading="compact"
                    weight="plus"
                  >
                    Value
                  </Text>
                  {attribute?.attributes?.[0]?.type === "swatch_visual" && (
                    <Text
                      className="text-center"
                      size="small"
                      leading="compact"
                      weight="plus"
                    >
                      Image
                    </Text>
                  )}
                  <Text
                    className="text-center"
                    size="small"
                    leading="compact"
                    weight="plus"
                  >
                    Actions
                  </Text>
                </div>

                <SortableList
                  items={options}
                  onChange={handleRankChange}
                  renderItem={(option, index) => (
                    <SortableList.Item
                      id={option.id}
                      className="bg-ui-bg-base border-b"
                    >
                      <div
                        className="text-ui-fg-subtle grid w-full items-center gap-3 px-6 py-3.5 relative"
                        style={{ gridTemplateColumns: "28px 1fr 1fr 1fr auto" }}
                      >
                        <SortableList.DragHandle />
                        <div className="relative">
                          <Input
                            id={`options.${index}.title`}
                            value={option.title}
                            onChange={(e) =>
                              handleOptionChange(index, "title", e.target.value)
                            }
                          />
                          {showErrors && validationErrors[`${index}.title`] && (
                            <Text className="text-red-500 text-xs absolute left-0 bottom-[-20px] error-message">
                              {validationErrors[`${index}.title`]}
                            </Text>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            id={`options.${index}.value`}
                            value={option.value}
                            onChange={(e) =>
                              handleOptionChange(index, "value", e.target.value)
                            }
                          />
                          {showErrors && validationErrors[`${index}.value`] && (
                            <Text className="text-red-500 text-xs absolute left-0 bottom-[-20px] error-message">
                              {validationErrors[`${index}.value`]}
                            </Text>
                          )}
                        </div>
                        {attribute?.attributes?.[0]?.type ===
                          "swatch_visual" && (
                          <div className="flex items-center justify-center">
                            {previewImages[index] ? (
                              <div className="p-4 relative flex flex-col items-center justify-center">
                                <img
                                  src={previewImages[index]}
                                  alt={`Preview for ${option.title}`}
                                  className="mt-2 max-w-[100px] max-h-[100px] object-contain"
                                />
                                <IconButton
                                  size="small"
                                  variant="transparent"
                                  className="text-red-500"
                                  onClick={() => {
                                    const newPreviewImages = [...previewImages];
                                    newPreviewImages[index] = "";
                                    setPreviewImages(newPreviewImages);
                                    const newUploadedFiles = [...uploadedFiles];
                                    newUploadedFiles[index] = null;
                                    setUploadedFiles(newUploadedFiles);
                                  }}
                                >
                                  <Trash />
                                </IconButton>
                              </div>
                            ) : (
                              <div className="p-4">
                                <FileUpload
                                  label={t("products.media.uploadImagesLabel")}
                                  hint={t("products.media.uploadImagesHint")}
                                  hasError={
                                    !!validationErrors[`${index}.value`]
                                  }
                                  formats={SUPPORTED_FORMATS}
                                  onUploaded={(files) =>
                                    handleFileUpload(index, files)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        )}
                        <IconButton
                          className="m-0"
                          size="small"
                          variant="transparent"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <XMarkMini />
                        </IconButton>
                      </div>
                    </SortableList.Item>
                  )}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end px-6 py-4">
            <Button onClick={handleSubmitOptions}>Save</Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ManageOptionsPage;

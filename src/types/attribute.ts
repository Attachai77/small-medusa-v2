export type ProductAttributeType =
    | "text"
    | "textarea"
    | "texteditor"
    | "date"
    | "datetime"
    | "boolean"
    | "multiselect"
    | "select"
    | "media_image"
    | "swatch_visual"
    | "swatch_text";

export enum ProductAttributeTypeEnum {
    text = "Text",
    textarea = "Textarea",
    texteditor = "Text Editor",
    date = "Date",
    datetime = "Date and Time",
    boolean = "Yes/No",
    multiselect = "Multiple Select",
    select = "Select",
    media_image = "Media Image",
    swatch_visual = "Visual Swatch",
    swatch_text = "Text Swatch",
}

export interface ProductAttributeOption {
    id?: string;
    title: string;
    value: string;
    rank: number;
    metadata?: Record<string, string>;
    attribute?: ProductAttribute;
}

export interface ProductAttribute {
    id?: string;
    title: string;
    code: string;
    description?: string;
    is_filterable: boolean;
    is_required: boolean;
    is_unique: boolean;
    rank: number;
    metadata?: Record<string, string>;
    status: boolean;
    type?: ProductAttributeType;
    options?: ProductAttributeOption[];
}

export interface ProductEditAttribute {
    attributes: ProductAttribute[];
}

export interface AttributeOption {
    id?: string;
    title: string;
    value: string;
    rank: number;
    metadata?: Record<string, string> | null;
    attribute?: ProductAttribute;
}

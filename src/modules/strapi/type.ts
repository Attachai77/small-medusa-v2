
import type { ProductCategoryDTO } from "@medusajs/types"
interface StrapiBaseData {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date | null;
  publishedAt?: Date | null;
  locale?: string;
}

export interface StrapiImage {
  data?: {
    attributes?: {
      url?: string;
      width?: number;
      height?: number;
      formats?: {
        large?: {
          url?: string;
          width?: number;
          height?: number;
        };
      };
    };
  };
}

export interface StrapiRawData {
  id: number;
  attributes: Record<string, unknown>;
}

export interface CmsPage extends StrapiBaseData {
  title: string;
  slug: string;
  content: string;
}

export interface Block extends StrapiBaseData {
  title: string;
  slug: string;
  content: string;
}

export interface MiniCategory extends StrapiBaseData {
  title: string;
  image: StrapiImage;
  product_category: ProductCategory;
}

export interface HomepageBanner extends StrapiBaseData {
  name: string;
  target_link: string;
  url: string;
  image?: StrapiImage;
}

export interface ProductCategory extends StrapiBaseData {
  name: string
  medusa_id: string
  banners?: {
    data: Image[]
  };
  description?: string
  handle: string
  is_active: boolean
  is_internal: boolean
}

export interface ProductCategoryStrapi {
  id: number
  attributes: ProductCategory
}

export interface ProductCategoryCustomDTO extends ProductCategoryDTO {
  strapi_id: number
  medusa_id: string
  banners: {
    data: Image[];
  };
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface Image {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      thumbnail: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    providerMetadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface HomeCategory {
  "id": number,
  "title": string,
  "rank": number,
  "createdAt": string,
  "updatedAt": string,
  "publishedAt": string,
  "locale": "th" | "en",
  "product_category": {
    "data": ProductCategory
  },
  "localizations": {
    "data": any[]
  },
  "desktop_image": StrapiImage,
  "mobile_image": StrapiImage
}
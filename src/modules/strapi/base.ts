import axios, { type AxiosInstance } from "axios";
import type { StrapiRawData, StrapiImage } from "./type";
import type { Logger } from "@medusajs/medusa";


export default class StrapiBaseService {
  protected readonly $http: AxiosInstance;
  protected readonly logger: Logger;
  constructor(container) {
    this.$http = this.createAxiosInstance();
    this.logger = container.logger;
  }

  private createAxiosInstance(): AxiosInstance {
    const { STRAPI_URL, STRAPI_SECRET } = process.env;

    if (!STRAPI_URL || !STRAPI_SECRET) {
      throw new Error("STRAPI_URL and STRAPI_SECRET must be defined in environment variables");
    }

    return axios.create({
      baseURL: `${STRAPI_URL}/api`,
      headers: {
        Authorization: `Bearer ${STRAPI_SECRET}`,
      },
    });
  }

  protected transformItem(item: StrapiRawData): Record<string, unknown> {
    const { image, ...otherAttributes } = item.attributes;
    const baseTransform = {
      id: item.id,
      ...otherAttributes,
    };

    if (!image) {
      return baseTransform;
    }

    const images = image as StrapiImage;
    return {
      ...baseTransform,
      desktop_image: {
        url: images.data?.attributes?.url,
        width: images.data?.attributes?.width,
        height: images.data?.attributes?.height,
      },
      mobile_image: {
        url: images.data?.attributes?.formats?.large?.url,
        width: images.data?.attributes?.formats?.large?.width,
        height: images.data?.attributes?.formats?.large?.height,
      },
    };
  }
}

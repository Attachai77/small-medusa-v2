import { MedusaService } from "@medusajs/utils"
import ProductAttributeModel from "./models/product-attribute"
import ProductAttributeOptionModel from "./models/product-attribute-option"
import type { Logger } from "@medusajs/medusa"
import type { ProductAttribute, ProductAttributeOption } from "../../types/attribute"

// @ts-ignore
class ProductAttributeService extends MedusaService({
  ProductAttribute: ProductAttributeModel,
  ProductAttributeOption: ProductAttributeOptionModel,
}) {
  private logger: Logger

  constructor(container) {
    super(container)
    this.logger = container.logger
  }

  async listAllAttributes() {
    try {
      return await this.listProductAttributeOptions()
    } catch (error) {
      this.logger.error("List all product attributes error", error)
      throw error
    }
  }

  async getAttributeById(id: string) {
    try {
      return await this.listProductAttributes({ id })
    } catch (error) {
      this.logger.error("Get product attribute by id error", error)
      return null
    }
  }

  async createAttribute(data: ProductAttribute) {
    try {
      return await this.createProductAttributes(data)
    } catch (error) {
      this.logger.error("Create product attribute error", error)
      throw error
    }
  }

  async updateAttributeById(id: string, data: Partial<ProductAttribute>) {
    try {
      return await this.updateProductAttributes({ id }, data)
    } catch (error) {
      this.logger.error("Update product attribute error", error)
      throw error
    }
  }

  async deleteAttributeById(id: string) {
    try {
      return await this.softDeleteProductAttributes({ id })
    } catch (error) {
      this.logger.error("Delete product attribute error", error)
      throw error
    }
  }

  async listAttributeOptions(id: string) {
    try {
      return await this.listProductAttributeOptions({ attribute_id: id }, {
        order: { rank: "ASC" }, take: 9999, skip: 0
      })
    } catch (error) {
      this.logger.error("List attribute options error", error)
      throw error
    }
  }

  async deleteProductAttributeOption(attributeId: string, optionId: string) {
    try {
      return await this.softDeleteProductAttributeOptions({
        attribute_id: attributeId,
        id: optionId
      })
    } catch (error) {
      this.logger.error("Delete product attribute option error", error)
      throw error
    }
  }

  async listAllAttributesWithOptions(where: Partial<ProductAttribute> = {}, limit = 999) {
    try {
      const attributes = await this.listProductAttributes(where);
      const attributesWithOptions = await Promise.all(attributes.map(async (attribute) => {

        const options = await this.listProductAttributeOptions({ attribute_id: attribute.id }, {
          take: 999,
          order: { rank: "ASC" }
        });
        /** temporary solution to limit the number of options */
        const option = options.slice(0, limit);

        return { ...attribute, options: option };
      }));
      return attributesWithOptions;
    } catch (error) {
      this.logger.error("List all attributes with options error", error);
      throw error;
    }
  }

  async retrieveProductAttributeOptionByCodeAndValue(code: string, value: string) {

    try {
      const attributes = await this.listProductAttributes({ code: code });
      const attributesWithOptions = await Promise.all(attributes.map(async (attribute) => {
        const options = await this.listProductAttributeOptions({ attribute_id: attribute.id, value: value });
        return { ...attribute, options: options };
      }));
      return attributesWithOptions;
    } catch (error) {
      this.logger.error("List all attributes with options error", error);
      throw error;
    }
  }

  async getAttributeByCode(code: string) {
    try {
      return await this.listProductAttributeOptions({ code: code })
    } catch (error) {
      this.logger.error("Get product attribute by code error", error)
      return null
    }
  }
}

export default ProductAttributeService
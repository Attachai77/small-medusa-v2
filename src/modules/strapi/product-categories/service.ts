import StrapiBaseService from "../base";
import type { ProductCategoryStrapi, ProductCategory } from "../type";
import type { ProductCategoryDTO } from "@medusajs/types"

export default class ProductCategoryStrapiService extends StrapiBaseService {

  async createProductCategory(category: ProductCategory): Promise<ProductCategoryStrapi> {
    try {
      const response = await this.$http.post("/product-categories", { data: category })
      return response.data?.data
    } catch (error) {
      this.handleHttpError("create strapi product-category", error.response.data.error)
      throw error
    }
  }

  async getProductCategoryByMedusaId(medusaId: string): Promise<ProductCategoryStrapi> {
    try {
      const response = await this.$http.get(
        `/product-categories?filters[medusa_id][$eq]=${medusaId}&populate=*`
      )
      return response.data?.data?.[0]
    } catch (error) {
      this.handleHttpError("get strapi product-category", error.response.data.error)
      return null
    }
  }

  async updateProductCategory(id: number, category: ProductCategory): Promise<ProductCategoryStrapi> {
    try {
      const response = await this.$http.put(`/product-categories/${id}`, { data: category })
      return response.data?.data
    } catch (error) {
      this.handleHttpError("update strapi product-category", error)
      return null
    }
  }

  async deleteProductCategoryByMedusaId(medusa_id: string): Promise<void> {
    try {
      const lists = await this.getListAllByMedusaId(medusa_id)
      lists.map(async (list) => {
        await this.$http.delete(`/product-categories/${list.id}`)
      })
    } catch (error) {
      this.handleHttpError("delete strapi product-category", error)
    }
  }
  async getListAllByMedusaId(medusa_id: string): Promise<ProductCategoryStrapi[]> {
    try {
      const url = "/product-categories";
      const params = new URLSearchParams({
        'filters[medusa_id][$eq]': medusa_id,
        'populate': '*',
        'locale[0]': 'th',
        'locale[1]': 'en',
      });
      const response = await this.$http.get(`${url}?${params}`);
      const data = response?.data?.data;

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      this.handleHttpError("Failed to get product-category", error)
      return null;
    }
  }

  async getListAll(locale: string): Promise<ProductCategoryStrapi[]> {
    try {
      const url = "/product-categories";
      const params = new URLSearchParams({
        locale,
        'populate': '*',
      });

      const response = await this.$http.get(`${url}?${params}`);
      const data = response?.data?.data;

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      this.handleHttpError("Failed to get product-category", error)
      return null;
    }
  }

  private handleHttpError(operation: string, error): void {
    this.logger.error(`${operation} error`, error)
    if (error.response) {
      this.logger.error(`Status: ${error.response.status}`)
      this.logger.error(`Data: ${JSON.stringify(error.response.data)}`)
    }
  }

  buildCategoryTree(categories: ProductCategoryDTO[], parent: ProductCategoryDTO, catesStrapi: ProductCategoryStrapi[]): ProductCategoryDTO[] {
    const result: ProductCategoryDTO[] = []

    categories.map((category: ProductCategoryDTO) => {
      category.parent_category = undefined
      if ((!parent && !category.parent_category_id) || (parent && parent.id === category.parent_category_id)) {
        const current = {
          ...category,
          category_children: this.buildCategoryTree(categories, category, catesStrapi),
          name: this.getAttribute(catesStrapi, category, 'name'),
          banners: this.getAttribute(catesStrapi, category, 'banners'),
          description: this.getAttribute(catesStrapi, category, 'description'),
        } as ProductCategoryDTO
        result.push(current)
      }
    })

    return result.sort((a, b) => a.rank - b.rank)
  }

  private getAttribute(catesStrapi: ProductCategoryStrapi[], category: ProductCategoryDTO, attribute: string): object | number | boolean | string | null {
    const matchedCategory = catesStrapi.find((cate: ProductCategoryStrapi) => cate.attributes.medusa_id === category.id)
    const original = category[attribute] ? category[attribute] : null
    return matchedCategory ? matchedCategory.attributes[attribute] : original
  }
}
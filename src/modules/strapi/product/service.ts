import StrapiBaseService from "../base";
import type { ProductStrapi } from "./type"


export default class ProductStrapiService extends StrapiBaseService {
    async createProduct(product: ProductStrapi): Promise<ProductStrapi> {
        try {
            const response = await this.$http.post("/products", { data: product })
            return response.data?.data
        } catch (error) {
            this.handleHttpError("create strapi product", error.response.data.error)
            throw error
        }
    }

    async updateProduct(id: number, product: ProductStrapi): Promise<ProductStrapi> {
        try {
            const response = await this.$http.put(`/products/${id}`, { data: product })
            return response.data?.data
        } catch (error) {
            this.handleHttpError("update strapi product", error.response.data.error)
            throw error
        }
    }

    async deleteProduct(id: number): Promise<void> {
        try {
            await this.$http.delete(`/products/${id}`)
        } catch (error) {
            this.handleHttpError("delete strapi product", error.response.data.error)
            throw error
        }
    }
    async deleteProductByMedusaId(medusa_id: string): Promise<void> {
        try {
            const response = await this.retrieveProductByMedusaId(medusa_id)
            await this.deleteProduct(response.id)
        } catch (error) {
            this.handleHttpError("delete strapi product", error.response.data.error)
            throw error
        }
    }

    async retrieveProduct(id: number): Promise<ProductStrapi> {
        try {
            const response = await this.$http.get(`/products/${id}`)
            return response.data?.data
        } catch (error) {
            this.handleHttpError("retrieve strapi product", error.response.data.error)
            throw error
        }
    }

    async retrieveProductByMedusaId(medusa_id: string): Promise<ProductStrapi> {
        try {
            const response = await this.$http.get(`/products?filters[medusa_id][$eq]=${medusa_id}&populate=*`)
            return response.data?.data[0]
        } catch (error) {
            this.handleHttpError("retrieve strapi product by medusa id", error.response.data.error)
            throw error
        }
    }

    private handleHttpError(operation: string, error): void {
        this.logger.error(`${operation} error`, error)
        if (error.response) {
            this.logger.error(`Status: ${error.response.status}`)
            this.logger.error(`Data: ${JSON.stringify(error.response.data)}`)
        }
    }
}
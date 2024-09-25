import type { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type { IProductModuleService, FilterableProductProps } from "@medusajs/types";
import { Modules } from "@medusajs/utils";
import type ProductAttributeService from "../../../../modules/product-attributes/service";
import getProductDetailWorkflow from '../../../../workflows/get-products-detail'
import type { ProductVariantDTO } from "@medusajs/types";

type CustomFilterableProductProps = FilterableProductProps & {
  metadata: Record<string, unknown>;
};

type ProductVariantDTOWithInventory = ProductVariantDTO & {
  inventory_quantity?: number;
};

export type SortOptions = "price_asc" | "price_desc" | "created_at";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const logger: Logger = req.scope.resolve("logger");
  const productModuleService: IProductModuleService = req.scope.resolve(
    Modules.PRODUCT,
  );
  const productAttributeService: ProductAttributeService = req.scope.resolve(
    "productAttributeModuleService",
  );

  try {
    const queryFields = req.query;
    logger.info(`Fetching products, query: ${JSON.stringify(queryFields, null, 2)}`);

    const { order = 'created_at' } = queryFields
    const limit = queryFields.limit ? parseInt(queryFields.limit as string) : 20
    const offset = queryFields.offset ? parseInt(queryFields.offset as string) : 0

    const filterableAttributes = await productAttributeService.listProductAttributes({
      is_filterable: true,
      status: true,
    })
    const filterListAttributes = filterableAttributes.map((attr) => attr.code)

    const metadataFilters = {} as Record<string, unknown>
    for (const key in queryFields) {
      if (!queryFields[key]) continue

      if (filterListAttributes.includes(key)) {
        metadataFilters[key] = queryFields[key]
      }
    }

    const filters: CustomFilterableProductProps = {
      metadata: metadataFilters,
    };

    if (queryFields['category']) {
      const [ category ] = await productModuleService.listProductCategories({
        handle: queryFields['category'] as string
      }, { select: [ 'id' ], take: 1 })
      if (category) queryFields['category_id'] = category.id
    }

    if (queryFields['category_id']) {
      const childrenCategories = await productModuleService.listProductCategories({
        parent_category_id: queryFields['category_id'] as string
      }, {
        select: [ 'id' ],
        relations: [ 'category_children' ]
      })

      const categoryIds = [
        queryFields['category_id']
      ]
      for (const childrenCategory of childrenCategories) {
        categoryIds.push(childrenCategory.id)
        for (const child of childrenCategory.category_children) {
          categoryIds.push(child.id)
        }
      }

      filters.categories = {
        id: {
          $in: categoryIds as string[]
        }
      }
    }

    if (queryFields['id'] && typeof queryFields['id'] === 'string') {
      filters.id = queryFields['id'].split(',')
    }

    const allProducts = await productModuleService.listProducts(filters, {
      take: 5000,
      select: [ 'id' ]
    });
    const productIds = allProducts.map((product) => product.id)

    const { result: productResults } = await getProductDetailWorkflow(req.scope).run({
      input: {
        productIds,
        sortBy: order === 'created_at' ? order : undefined
      }
    })

    let products = [
      ...productResults
    ]

    // filter pricing
    if (queryFields['price']) {
      const priceRange = queryFields['price'] as string
      const [ min, max ] = priceRange.split('_')

      // check is number string
      if (isNaN(parseInt(min)) || isNaN(parseInt(max))) {
        res.status(400).json({ error: "Invalid price range" });
        return
      }

      const filteredProducts = products.filter((product) => {
        const variantPrices = product.variants.map((variant) => {
          return variant['calculated_price']?.['calculated_amount'] || undefined
        }).filter(Boolean) as number[]
        if (!variantPrices.length) return false

        const minPriceProduct = Math.min(...variantPrices)
        const maxPriceProduct = Math.max(...variantPrices)

        return minPriceProduct >= parseInt(min) && maxPriceProduct <= parseInt(max)
      })
      products = filteredProducts
    }

    if (order === 'price_asc' || order === 'price_desc') {
      products = products.filter((product) => {
        return product.variants.some((variant) => {
          return variant['calculated_price']?.['calculated_amount'] !== undefined
        })
      })
      products = products.sort((a, b) => {
        const aPrices = a.variants.map((variant) => {
          return variant['calculated_price']?.['calculated_amount'] || undefined
        }).filter(Boolean) as number[]
        const bPrices = b.variants.map((variant) => {
          return variant['calculated_price']?.['calculated_amount'] || undefined
        }).filter(Boolean) as number[]

        if (!aPrices.length || !bPrices.length) return 0

        const aMinPrice = Math.min(...aPrices)
        const bMinPrice = Math.min(...bPrices)

        if (order === 'price_asc') {
          return aMinPrice - bMinPrice
        } else {
          return bMinPrice - aMinPrice
        }
      })
    }

    const count = products.length || 0

    // offset products
    if (offset) {
      products = products.slice(offset)
    }

    // limit products
    if (products.length > limit) {
      products = products.slice(0, limit)
    }

    const productAttributes = await productAttributeService.listAllAttributesWithOptions({
      status: true,
    })
    const productAttributeCodes = productAttributes.map((attr) => attr.code)

    for await (const product of products) {
      if (!product.metadata) continue

      for (const attr in product.metadata) {
        if (!productAttributeCodes.includes(attr)) continue

        const productAttribute = productAttributes.find((productAttribute) => productAttribute.code === attr)

        const option = productAttribute?.options?.find((option) => option.value === product.metadata[attr])
        delete productAttribute.options

        if (!product['product_attributes']) {
          product['product_attributes'] = []
        }
        if (option) {
          product['product_attributes'].push({
            ...productAttribute,
            option
          })
        }
      }
    }

    // Update the sorting function to move products with all variants having inventory_quantity = 0 to the end
    products.sort((a, b) => {
      const aAllZeroInventory = (a.variants as ProductVariantDTOWithInventory[]).every(v => v.inventory_quantity === 0);
      const bAllZeroInventory = (b.variants as ProductVariantDTOWithInventory[]).every(v => v.inventory_quantity === 0);

      if (aAllZeroInventory && !bAllZeroInventory) return 1;
      if (!aAllZeroInventory && bAllZeroInventory) return -1;
      return 0;
    });

    res.json({
      products,
      count,
      offset,
      limit
    });

  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching products",
        error_message: error.message
      });
  }
}

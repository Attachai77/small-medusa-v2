import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import type { Logger } from '@medusajs/medusa'
import { IProductModuleService, ProductCategoryDTO } from '@medusajs/types'
import { Modules } from '@medusajs/utils'
import { ProductFilterFormOption } from '../index'

export interface BuildCategoriesResponse extends ProductFilterFormOption {
}

const buildCategoriesCategoryStep = createStep(
  "build-categories-step",
  async (input: { categoryIds: string[] }, context) => {
    const logger: Logger = context.container.resolve('logger')
    const productService: IProductModuleService = context.container.resolve(Modules.PRODUCT)
    const { categoryIds } = input

    const categoriesForm: BuildCategoriesResponse[] = []
    if (!categoryIds && categoryIds.length === 0) {
      return new StepResponse({
        categories: categoriesForm,
      }, {
        previousData: {},
      })
    }

    const categories = await productService.listProductCategories({
      id: categoryIds
    }, {
      select: [ '*' ],
      order: {
        rank: 'ASC'
      }
    })

    for await (const category of categories) {
      categoriesForm.push({
        id: category.id,
        title: category.name,
        value: category.handle,
        rank: category.rank,
      })
    }

    return new StepResponse({
      categories: categoriesForm,
    }, {
      previousData: {},
    })

  },
  async ({ previousData }, context) => {
  }
);

export default buildCategoriesCategoryStep;
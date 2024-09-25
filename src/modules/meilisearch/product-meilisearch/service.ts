import MeiliSearchClientService from '../services/meilisearch-client'
import { ProductDTO } from '@medusajs/types'
import { ProductMeiliSearch } from '../../../workflows/sync-product-to-meilisearch'

class ProductMeiliSearchModuleService {
  protected readonly indexName = "products"
  protected readonly meiliSearchClientService: MeiliSearchClientService

  constructor() {
    this.meiliSearchClientService = new MeiliSearchClientService({
      indexName: this.indexName
    })
  }

  async addOrUpdate(product: ProductDTO) {
    return await this.meiliSearchClientService.addOrReplaceDocuments([ product ])
  }

  async bulkAddOrUpdate(products: ProductMeiliSearch[]) {
    return await this.meiliSearchClientService.addOrReplaceDocuments(products)
  }

  delete(productId: string) {
    return this.meiliSearchClientService.deleteDocument(productId)
  }

  deleteAll() {
    return this.meiliSearchClientService.deleteAllDocuments()
  }

  ///// can set settings via postman
  // setting(){
  //   return {
  //     displayedAttributes: [
  //       "id",
  //       "title",
  //       "subtitle",
  //       "description",
  //       "variant_sku",
  //       "thumbnail",
  //       "handle"
  //     ],
  //     searchableAttributes: [
  //       "title",
  //       "description",
  //       "variant_sku"
  //     ],
  //     filterableAttributes: [],
  //     sortableAttributes: [],
  //     rankingRules: [
  //       "words",
  //       "typo",
  //       "proximity",
  //       "attribute",
  //       "sort",
  //       "exactness"
  //     ],
  //     stopWords: [],
  //     nonSeparatorTokens: [],
  //     separatorTokens: [],
  //     dictionary: [],
  //     synonyms: {},
  //     distinctAttribute: null,
  //     roximityPrecision: "byWord",
  //     typoTolerance: {
  //       enabled: true,
  //       minWordSizeForTypos: {
  //         "oneTypo": 5,
  //         "twoTypos": 9
  //       },
  //       disableOnWords: [],
  //       disableOnAttributes: []
  //     },
  //     faceting: {
  //       maxValuesPerFacet: 100,
  //       sortFacetValuesBy: {
  //         "*": "alpha"
  //       }
  //     },
  //     pagination: {
  //       maxTotalHits: 1000
  //     },
  //     searchCutoffMs: null
  //   }
  // }

}

export default ProductMeiliSearchModuleService;
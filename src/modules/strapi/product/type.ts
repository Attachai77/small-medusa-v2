export interface ProductStrapi {
  id?: number,
  medusa_id: string;
  title: string;
  handle: string;
  short_description?: string;
  localizations?: {
    data: string[]
  }
}

export interface ProductStrapiResponse {
  id?: number,
  attributes?: ProductStrapi

}
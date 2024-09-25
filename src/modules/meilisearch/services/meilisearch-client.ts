import { MeiliSearch, ErrorStatusCode } from 'meilisearch'

export class MeiliSearchClientService {
  protected indexName: string
  protected client: MeiliSearch

  constructor({ indexName }: { indexName: string }) {
    this.indexName = indexName

    const MEILISEARCH_URL = process.env.MEILISEARCH_URL
    const MEILISEARCH_ADMIN_API_KEY = process.env.MEILISEARCH_ADMIN_API_KEY
    // if(!MEILISEARCH_URL || !MEILISEARCH_ADMIN_API_KEY) {
    //   throw new Error("MEILISEARCH_URL and MEILISEARCH_ADMIN_API_KEY must be set")
    // }

    this.client = new MeiliSearch({
      host: MEILISEARCH_URL,
      apiKey: MEILISEARCH_ADMIN_API_KEY,
    })
  }

  createIndex(indexName: string, options: Record<string, string> = { primaryKey: "id" } ) {
    return this.client.createIndex(indexName, options)
  }

  getIndex(indexName: string) {
    return this.client.index(indexName);
  }

  async upsertIndex(indexName) {
    try {
      await this.client.getIndex(indexName);
    }
    catch (error) {
      if (error.code === ErrorStatusCode.INDEX_NOT_FOUND) {
        await this.createIndex(indexName, {
          primaryKey: "id",
        });
      }
    }
  }

  async addOrReplaceDocuments(documents: Record<string, any>[]) {
    return await this.client
      .index(this.indexName)
      .addDocuments(documents);
  }

  async addOrPartialUpdateDocuments(documents: Record<string, any>[]) {
    return await this.client
      .index(this.indexName)
      .updateDocuments(documents);
  }

  async deleteDocument(documentId) {
    return await this.client.index(this.indexName).deleteDocument(documentId);
  }

  async deleteAllDocuments() {
    return await this.client.index(this.indexName).deleteAllDocuments();
  }

  async search(query, options) {
    const { paginationOptions, filter, additionalOptions } = options;
    return await this.client
      .index(this.indexName)
      .search(query, { filter, ...paginationOptions, ...additionalOptions });
  }

  async updateSettings(settings) {
    // backward compatibility
    const indexSettings = settings.indexSettings ?? settings ?? {};
    await this.upsertIndex(this.indexName);
    return await this.client.index(this.indexName).updateSettings(indexSettings);
  }
}

export default MeiliSearchClientService
const logger = require('../utils/logger');

class ElasticsearchService {
  constructor(client) {
    this.client = client;
  }

  async createIndex(indexName) {
    try {
      const indexExists = await this.client.indices.exists({ index: indexName });

      if (!indexExists) {
        await this.client.indices.create({
          index: indexName,
          body: {
            mappings: {
              properties: {
                providerName: { type: 'text' },
                category: { type: 'keyword' },
                userSub: { type: 'keyword' },
                services: {
                  type: 'nested',
                  properties: {
                    name: { type: 'text' },
                    cost: { type: 'float' }
                  }
                }
              }
            }
          }
        });
        logger.info(`Index ${indexName} created successfully`);
      } else {
        logger.info(`Index ${indexName} already exists`);
      }
    } catch (error) {
      if (error.name === 'ProductNotSupportedError') {
        logger.error('Elasticsearch version incompatibility', { error });
        throw new Error('Your Elasticsearch version is not compatible with the client. Please check your Elasticsearch version and update the client if necessary.');
      } else {
        logger.error(`Error creating index ${indexName}`, { error });
        throw new Error(`Failed to create index ${indexName}: ${error.message}`);
      }
    }
  }

  async indexDocument(indexName, document) {
    try {
      const result = await this.client.index({
        index: indexName,
        body: document,
        refresh: 'wait_for'
      });
      logger.info('Document indexed successfully', { id: result._id, index: indexName });
      return result;
    } catch (error) {
      logger.error('Error indexing document', { error, index: indexName });
      throw new Error(`Failed to index document: ${error.message}`);
    }
  }

  async search(indexName, query) {
    try {
      const result = await this.client.search({
        index: indexName,
        body: query
      });
      return result.body.hits;
    } catch (error) {
      logger.error(`Error searching index ${indexName}`, { error, query });
      throw new Error(`Failed to search index ${indexName}: ${error.message}`);
    }
  }

  async deleteDocument(indexName, id) {
    try {
      const result = await this.client.delete({
        index: indexName,
        id: id,
        refresh: 'wait_for'
      });
      logger.info('Document deleted successfully', { id: id, index: indexName });
      return result;
    } catch (error) {
      logger.error('Error deleting document', { error, index: indexName, id: id });
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }
}

module.exports = ElasticsearchService;

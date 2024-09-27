const { client } = require('../config/elasticsearch');
const ElasticsearchService = require('./elasticsearchService');
const esService = new ElasticsearchService(client);
const logger = require('../utils/logger');

class SearchService {
  static async submitData(data) {
    try {
      return await esService.indexDocument('service_providers', data);
    } catch (error) {
      logger.error('Error submitting data', { error });
      throw error;
    }
  }

  static async searchData(query, category) {
    try {
      let searchQuery;

      if (query && category) {
        searchQuery = {
          bool: {
            must: [
              { multi_match: { query: query, fields: ['providerName', 'services.name'] } },
              { match: { category: category } }
            ]
          }
        };
      } else if (query) {
        searchQuery = {
          multi_match: { query: query, fields: ['providerName', 'services.name'] }
        };
      } else if (category) {
        searchQuery = {
          match: { category: category }
        };
      } else {
        throw new Error('Either query or category must be provided');
      }

      const result = await esService.search('service_providers', { query: searchQuery });

      return {
        total: result.total.value,
        hits: result.hits.map(hit => ({
          id: hit._id,
          score: hit._score,
          ...hit._source
        }))
      };
    } catch (error) {
      logger.error('Error searching data', { error, query, category });
      throw error;
    }
  }

  static async deleteData(id) {
    try {
      return await esService.deleteDocument('service_providers', id);
    } catch (error) {
      logger.error('Error deleting data', { error, id });
      throw error;
    }
  }
}

module.exports = SearchService;

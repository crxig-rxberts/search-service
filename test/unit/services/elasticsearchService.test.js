const ElasticsearchService = require('../../../src/services/elasticsearchService');

describe('Elasticsearch Service', () => {
  let mockClient;
  let esService;

  beforeEach(() => {
    mockClient = {
      indices: {
        exists: jest.fn(),
        create: jest.fn()
      },
      index: jest.fn(),
      search: jest.fn(),
      delete: jest.fn()
    };
    esService = new ElasticsearchService(mockClient);
  });

  describe('createIndex', () => {
    it('should create index if it does not exist', async () => {
      mockClient.indices.exists.mockResolvedValue(false);
      await esService.createIndex('test-index');
      expect(mockClient.indices.create).toHaveBeenCalled();
    });

    it('should not create index if it already exists', async () => {
      mockClient.indices.exists.mockResolvedValue(true);
      await esService.createIndex('test-index');
      expect(mockClient.indices.create).not.toHaveBeenCalled();
    });

    it('should handle ProductNotSupportedError', async () => {
      const error = new Error('Version incompatible');
      error.name = 'ProductNotSupportedError';
      mockClient.indices.exists.mockRejectedValue(error);
      await expect(esService.createIndex('test-index')).rejects.toThrow('Your Elasticsearch version is not compatible');
    });
  });

  describe('indexDocument', () => {
    it('should index document successfully', async () => {
      const mockResult = { _id: '123' };
      mockClient.index.mockResolvedValue(mockResult);
      const result = await esService.indexDocument('test-index', { data: 'test' });
      expect(result).toEqual(mockResult);
    });

    it('should handle indexing errors', async () => {
      mockClient.index.mockRejectedValue(new Error('Indexing error'));
      await expect(esService.indexDocument('test-index', { data: 'test' })).rejects.toThrow('Failed to index document');
    });
  });

  describe('search', () => {
    it('should search successfully', async () => {
      const mockResult = { body: { hits: { total: 1, hits: [{ _id: '123' }] } } };
      mockClient.search.mockResolvedValue(mockResult);
      const result = await esService.search('test-index', { query: 'test' });
      expect(result).toEqual(mockResult.body.hits);
    });

    it('should handle search errors', async () => {
      mockClient.search.mockRejectedValue(new Error('Search error'));
      await expect(esService.search('test-index', { query: 'test' })).rejects.toThrow('Failed to search index');
    });
  });

  describe('deleteDocument', () => {
    it('should delete document successfully', async () => {
      const mockResult = { body: { result: 'deleted' } };
      mockClient.delete.mockResolvedValue(mockResult);
      const result = await esService.deleteDocument('test-index', '123');
      expect(result).toEqual(mockResult);
    });

    it('should handle deletion errors', async () => {
      mockClient.delete.mockRejectedValue(new Error('Deletion error'));
      await expect(esService.deleteDocument('test-index', '123')).rejects.toThrow('Failed to delete document');
    });
  });
});

const SearchService = require('../../../src/services/searchService');
const ElasticsearchService = require('../../../src/services/elasticsearchService');

jest.mock('../../../src/services/elasticsearchService');
jest.mock('../../../src/utils/logger');

describe('Search Service', () => {
  beforeEach(() => {
    ElasticsearchService.mockClear();
  });

  describe('submitData', () => {
    it('should submit data successfully', async () => {
      const mockData = { providerName: 'Test Provider' };
      const mockResult = { _id: '123' };

      ElasticsearchService.prototype.indexDocument.mockResolvedValue(mockResult);

      const result = await SearchService.submitData(mockData);

      expect(ElasticsearchService.prototype.indexDocument).toHaveBeenCalledWith('service_providers', mockData);
      expect(result).toEqual(mockResult);
    });

    it('should handle errors', async () => {
      const mockData = { providerName: 'Test Provider' };

      ElasticsearchService.prototype.indexDocument.mockRejectedValue(new Error('Test error'));

      await expect(SearchService.submitData(mockData)).rejects.toThrow('Test error');
    });
  });

  describe('searchData', () => {
    it('should search data successfully with query and category', async () => {
      const mockQuery = 'test';
      const mockCategory = 'category';
      const mockResult = {
        total: { value: 1 },
        hits: [{ _id: '123', _score: 1, _source: { providerName: 'Test Provider' } }]
      };

      ElasticsearchService.prototype.search.mockResolvedValue(mockResult);

      const result = await SearchService.searchData(mockQuery, mockCategory);

      expect(ElasticsearchService.prototype.search).toHaveBeenCalledWith('service_providers', expect.any(Object));
      expect(result).toEqual({
        total: 1,
        hits: [{ id: '123', score: 1, providerName: 'Test Provider' }]
      });
    });

    it('should search data successfully with only query', async () => {
      const mockQuery = 'test';
      const mockResult = {
        total: { value: 1 },
        hits: [{ _id: '123', _score: 1, _source: { providerName: 'Test Provider' } }]
      };

      ElasticsearchService.prototype.search.mockResolvedValue(mockResult);

      const result = await SearchService.searchData(mockQuery);

      expect(ElasticsearchService.prototype.search).toHaveBeenCalledWith('service_providers', expect.any(Object));
      expect(result.total).toBe(1);
      expect(result.hits).toHaveLength(1);
    });

    it('should search data successfully with only category', async () => {
      const mockCategory = 'category';
      const mockResult = {
        total: { value: 2 },
        hits: [
          { _id: '123', _score: 1, _source: { providerName: 'Test Provider 1' } },
          { _id: '124', _score: 0.8, _source: { providerName: 'Test Provider 2' } }
        ]
      };

      ElasticsearchService.prototype.search.mockResolvedValue(mockResult);

      const result = await SearchService.searchData(null, mockCategory);

      expect(ElasticsearchService.prototype.search).toHaveBeenCalledWith('service_providers', expect.any(Object));
      expect(result.total).toBe(2);
      expect(result.hits).toHaveLength(2);
    });

    it('should throw an error when neither query nor category is provided', async () => {
      await expect(SearchService.searchData()).rejects.toThrow('Either query or category must be provided');
    });

    it('should handle errors', async () => {
      ElasticsearchService.prototype.search.mockRejectedValue(new Error('Test error'));

      await expect(SearchService.searchData('test', 'category')).rejects.toThrow('Test error');
    });
  });

  describe('deleteData', () => {
    it('should delete data successfully', async () => {
      const mockId = '123';
      const mockResult = { result: 'deleted' };

      ElasticsearchService.prototype.deleteDocument.mockResolvedValue(mockResult);

      const result = await SearchService.deleteData(mockId);

      expect(ElasticsearchService.prototype.deleteDocument).toHaveBeenCalledWith('service_providers', mockId);
      expect(result).toEqual(mockResult);
    });

    it('should handle errors', async () => {
      const mockId = '123';

      ElasticsearchService.prototype.deleteDocument.mockRejectedValue(new Error('Test error'));

      await expect(SearchService.deleteData(mockId)).rejects.toThrow('Test error');
    });
  });
});

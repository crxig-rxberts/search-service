const { submitData, searchData, deleteData } = require('../../../src/controllers/searchController');
const SearchService = require('../../../src/services/searchService');
const { BadGatewayError, NotFoundError } = require('../../../src/middleware/errors');

jest.mock('../../../src/services/searchService');
jest.mock('../../../src/utils/logger');

describe('Search Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('submitData', () => {
    it('should submit data successfully', async () => {
      const mockResult = { body: { _id: '123' } };
      SearchService.submitData.mockResolvedValue(mockResult);

      await submitData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Data submitted successfully',
        id: '123'
      });
    });

    it('should handle errors', async () => {
      SearchService.submitData.mockRejectedValue(new Error('Test error'));

      await submitData(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadGatewayError));
    });
  });

  describe('searchData', () => {
    it('should search data successfully', async () => {
      const mockResult = { total: 1, hits: [{ id: '123', data: 'test' }] };
      SearchService.searchData.mockResolvedValue(mockResult);

      req.query = { query: 'test', category: 'category' };

      await searchData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        total: 1,
        hits: [{ id: '123', data: 'test' }]
      });
    });

    it('should handle errors', async () => {
      SearchService.searchData.mockRejectedValue(new Error('Test error'));

      await searchData(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadGatewayError));
    });
  });

  describe('deleteData', () => {
    it('should delete data successfully', async () => {
      const mockResult = { body: { result: 'deleted' } };
      SearchService.deleteData.mockResolvedValue(mockResult);

      req.params = { id: '123' };

      await deleteData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Data deleted successfully',
        id: '123'
      });
    });

    it('should handle not found error', async () => {
      const mockResult = { body: { result: 'not_found' } };
      SearchService.deleteData.mockResolvedValue(mockResult);

      req.params = { id: '123' };

      await deleteData(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it('should handle other errors', async () => {
      SearchService.deleteData.mockRejectedValue(new Error('Test error'));

      req.params = { id: '123' };

      await deleteData(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadGatewayError));
    });
  });
});

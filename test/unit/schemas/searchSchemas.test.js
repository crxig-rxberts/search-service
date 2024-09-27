const { validateSubmitData, validateSearchQuery, validateDeleteData } = require('../../../src/schemas/searchSchemas');

describe('Search Schemas Validation', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validateSubmitData', () => {
    it('should pass valid data', () => {
      mockReq.body = {
        providerName: 'Test Provider',
        category: 'Test Category',
        userSub: '123e4567-e89b-12d3-a456-426614174000',
        services: [{ name: 'Test Service', cost: 100 }]
      };
      validateSubmitData(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail with invalid data', () => {
      mockReq.body = {
        providerName: 'T', // Too short
        category: 'Test Category',
        userSub: 'invalid-uuid',
        services: []
      };
      validateSubmitData(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });

  describe('validateSearchQuery', () => {
    it('should pass with valid query', () => {
      mockReq.query = { query: 'test' };
      validateSearchQuery(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should pass with valid category', () => {
      mockReq.query = { category: 'test category' };
      validateSearchQuery(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail with no query or category', () => {
      mockReq.query = {};
      validateSearchQuery(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });

    it('should fail with invalid query', () => {
      mockReq.query = { query: '' };
      validateSearchQuery(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });

  describe('validateDeleteData', () => {
    it('should pass with valid id', () => {
      mockReq.params = { id: '123' };
      validateDeleteData(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should fail with missing id', () => {
      mockReq.params = {};
      validateDeleteData(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
    });
  });
});

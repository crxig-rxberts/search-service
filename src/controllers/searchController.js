import { BadGatewayError, NotFoundError } from '../middleware/errors';
import SearchService from '../services/searchService';
import logger from '../utils/logger';

export const submitData = async (req, res, next) => {
  try {
    const result = await SearchService.submitData(req.body);
    res.status(201).json({
      success: true,
      message: 'Data submitted successfully',
      id: result.body._id,
    });
  } catch (error) {
    logger.error('Error submitting data to Elasticsearch', { error });
    next(error instanceof BadGatewayError ? error : new BadGatewayError('Error submitting data'));
  }
};

export const searchData = async (req, res, next) => {
  try {
    const { query, category } = req.query;
    const result = await SearchService.searchData(query, category);
    res.status(200).json({
      success: true,
      total: result.total,
      hits: result.hits
    });
  } catch (error) {
    logger.error('Error searching data in Elasticsearch', { error });
    next(new BadGatewayError('Error searching data'));
  }
};

export const deleteData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SearchService.deleteData(id);

    if (result.body.result === 'not_found') {
      throw new NotFoundError('Document not found');
    }

    res.status(200).json({
      success: true,
      message: 'Data deleted successfully',
      id: id,
    });
  } catch (error) {
    logger.error('Error deleting data from Elasticsearch', { error, id: req.params.id });
    if (error instanceof NotFoundError) {
      next(error);
    } else {
      next(new BadGatewayError('Error deleting data'));
    }
  }
};

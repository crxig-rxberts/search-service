const app = require('./src/app');
const { client, testConnection, ElasticsearchService } = require('./src/config/elasticsearch');
const logger = require('./src/utils/logger');

const port = process.env.PORT || 3002;

async function startServer() {
  try {
    await testConnection();
    logger.info('Successfully connected to Elasticsearch');

    const esService = new ElasticsearchService(client);
    await esService.createIndex('service_providers');

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown', { error });
  process.exit(1);
});

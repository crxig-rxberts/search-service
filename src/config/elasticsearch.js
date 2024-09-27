const { Client } = require('@elastic/elasticsearch');
const ElasticsearchService = require('../services/elasticsearchService');
const logger = require('../utils/logger');

const elasticsearchConfig = {
  node: process.env.ELASTICSEARCH_URL || 'http://host.docker.internal:9200',
  maxRetries: 5,
  requestTimeout: 60000,
  ssl: {
    rejectUnauthorized: false
  },
};

const client = new Client(elasticsearchConfig);

async function testConnection() {
  try {
    logger.info('Attempting to connect to Elasticsearch...');
    const nodeInfo = await client.info();
    if (!nodeInfo || !nodeInfo.body || !nodeInfo.body.version || !nodeInfo.body.version.number) {
      throw new Error('Unexpected response from Elasticsearch');
    }
    logger.info('ElasticSearch Info: ' + JSON.stringify({
      version: nodeInfo.body.version.number,
      clusterName: nodeInfo.body.cluster_name
    }));
  } catch (error) {
    logger.error('Failed to connect to Elasticsearch', {
      error: error.message,
      stack: error.stack,
      meta: error.meta
    });
    throw error;
  }
}

module.exports = { client, testConnection, ElasticsearchService };


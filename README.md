# Search Service

Search service for Bookit with Elasticsearch integration.

## Prerequisites

- Docker and Docker Compose installed.
- Ensure a `.env` file exists with the required environment variables.

## Environment Variables

- `ELASTICSEARCH_URL`: The URL for connecting to the Elasticsearch instance (default: `http://localhost:9200`)
- `PORT`: The port the service will run on (default: `3002`)

## Example `.env` file:

```
ELASTICSEARCH_URL=http://localhost:9200
PORT=3002
```

## Running Locally with Docker Compose

The service is dependent on ElasticSearch. Docker compose can be used wit this file in the root of the project [docker-compose.yml](docker-compose.yml). 

You can then connect to the kibana UI here http://localhost:5601.

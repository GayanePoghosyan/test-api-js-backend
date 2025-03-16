const config = require('../../config');

module.exports = {
  dev: {
    username: config.database?.user || 'postgres',
    password: config.database?.password || '123123',
    database: config.database?.name || 'test_api_db',
    host: config.database?.host || 'localhost',
    port: config.database?.port || 5432,
    dialect: 'postgres',
    migrationStorage: 'json', 
  },
  prod: {
    username: config.database?.user,
    password: config.database?.password,
    database: config.database?.name,
    host: config.database?.host,
    port: config.database?.port,
    dialect: 'postgres',
  }
};

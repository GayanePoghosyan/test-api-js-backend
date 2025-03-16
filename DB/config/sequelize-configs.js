const { Sequelize } = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database?.host || 'localhost',
  port: config.database?.port || 5432,
  username: config.database?.username || 'postgres',
  password: config.database?.password || '123123',
  database: config.database?.name || 'test_api_db',
  logging: false
});

module.exports = sequelize;
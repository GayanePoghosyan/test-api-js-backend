const sequelize = require('../DB/config/sequelize-configs');
const logger = require('./logger.service')(module);

let databaseInstance = null;

const initializeDatabase = (sequelizeInstance) => {
  if (databaseInstance) {
    return databaseInstance;
  }

  const connect = async (maxRetries = 3, retryDelay = 1000) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        await sequelizeInstance.authenticate();
        logger.info('Connected to database');
        return;
      } catch (error) {
        retries++;
        logger.warn(`Retry ${retries}/${maxRetries} for database`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    throw new Error(`Failed to connect after ${maxRetries} attempts`);
  };

  const disconnect = async () => {
    try {
      await sequelizeInstance.close();
      logger.info('Disconnected from database');
    } catch (error) {
      logger.error('Disconnection error:', error.message);
      throw error;
    }
  };

  databaseInstance = {
    connect,
    disconnect,
    sequelize: sequelizeInstance
  };

  return databaseInstance;
};

const database = initializeDatabase(sequelize);

module.exports = { database, initializeDatabase };
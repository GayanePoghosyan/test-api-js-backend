const { User } = require('../../../DB/models');
const logger = require('../../../services/logger.service')(module);
const { send } = require('../../../services/response.service');
const { BadRequest } = require('../../../constants/errors');
const { CREATED } = require('../../../constants/http-codes');

async function register(req, res, next) {
  try {
    logger.init('register user');
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequest('Username already exists');
    }

    const user = await User.create({ username, password });

    send(CREATED, res, {
      data: {
        id: user.id,
        username: user.username
      }
    }, 'User registered successfully');
    logger.success();
  } catch (error) {
    logger.error('Failed to register user:', error.message);
    next(error);
  }
};

module.exports = {
  register
};

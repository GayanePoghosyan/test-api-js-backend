const JwtService = require("../../../services/jwt.service");
const { User } = require('../../../DB/models');
const { BadRequest } = require('../../../constants/errors');
const { OK } = require('../../../constants/http-codes');
const { send } = require('../../../services/response.service');
const logger = require('../../../services/logger.service')(module);
const jwtConfig = require("../../../config").jwt;


async function login(req, res, next) {
  try {
    logger.init('login user');
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validatePassword(password))) {
      throw new BadRequest('Invalid credentials');
    }

    const token = new JwtService(jwtConfig).encode(user).data;

    res.header("Authorization", `Bearer ${token}`);

    send(OK, res, {
      data: {
        token,
        tokenType: 'Bearer',
        user: {
          id: user.id,
          username: user.username
        }
      }
    }, 'User logged in successfully');
    logger.success();

  } catch (error) {
    logger.error('Failed to login user:', error.message);
    next(error);
  }
};

module.exports = { login };

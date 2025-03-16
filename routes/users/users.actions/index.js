// User actions will be added here as needed
const { register } = require('./user-register.auth.action');
const { login } = require('./user-login.auth.action');

module.exports = {
  register,
  login
};

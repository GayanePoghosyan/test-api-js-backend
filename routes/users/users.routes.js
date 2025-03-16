const { Router } = require("express");
const actions = require("./users.actions");
const { registerValidation, loginValidation } = require("./users.validator");

module.exports = Router()
  .post("/users/register", ...registerValidation, actions.register)
  .post("/users/login", ...loginValidation, actions.login);

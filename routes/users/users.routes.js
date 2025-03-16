const { Router } = require("express");
const actions = require("./users.actions");
const { registerValidation, loginValidation } = require("./users.validator");

module.exports = Router()
  .post("/auth/register", ...registerValidation, actions.register)
  .post("/auth/login", ...loginValidation, actions.login);

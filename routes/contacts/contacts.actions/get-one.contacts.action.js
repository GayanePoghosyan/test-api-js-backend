const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const { Contact } = require("../../../DB/models");
const { NotFound } = require("../../../constants/errors");
const { send } = require("../../../services/response.service");

async function getOne(req, res, next) {
  try {
    logger.init("get contact");
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new NotFound("Contact not found");
    }

    send(OK, res, contact, "Contact retrieved successfully");
    logger.success();
  } catch (error) {
    logger.error("get contact error:", error.message);
    next(error);
  }
}

module.exports = {
  getOne,
};

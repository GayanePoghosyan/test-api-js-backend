const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const { Contact } = require("../../../DB/models");
const { NotFound } = require("../../../constants/errors");
const { send } = require("../../../services/response.service");

async function editOne(req, res, next) {
  try {
    logger.init("edit contact");
    const { id } = req.params;
    const data = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new NotFound("Contact not found");
    }

    await contact.update(data);
    await contact.reload();
    send(OK, res, contact, "Contact updated successfully");
    logger.success();
  } catch (error) {
    logger.error("edit contact error:", error.message);
    next(error);
  }
}

module.exports = {
  editOne,
};

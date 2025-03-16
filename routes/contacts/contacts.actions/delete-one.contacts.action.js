const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const { Contact, Company } = require("../../../DB/models");
const { NotFound } = require("../../../constants/errors");
const { send } = require("../../../services/response.service");

async function deleteOne(req, res, next) {
  try {
    logger.init("delete contact");
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      throw new NotFound("Contact not found");
    }
    await Company.update(
      { contactId: null },
      { where: { contactId: id } }
    );

    await contact.destroy();

    send(OK, res, null, "Contact deleted successfully");
    logger.success();
  } catch (error) {
    logger.error("delete contact error:", error.message);
    next(error);
  }
}

module.exports = {
  deleteOne,
};

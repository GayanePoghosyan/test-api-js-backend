const logger = require("../../../services/logger.service")(module);
const { Contact } = require("../../../DB/models");
const { CREATED } = require("../../../constants/http-codes");
const { send } = require("../../../services/response.service");
const { BadRequest } = require("../../../constants/errors");

async function create(req, res, next) {
  try {
    logger.init("create contact");

    const contactData = {
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      phone: req.body.phone,
      email: req.body.email
    };

    const existingContact = await Contact.findOne({ where: { email: contactData.email } });
    if (existingContact) {
      throw new BadRequest('Contacts with this email already exists');
    }

    const contact = await Contact.create(contactData);

    send(CREATED, res, contact, "Contact created successfully");
    logger.success();
  } catch (error) {
    logger.error("create contact error:", error.message);
    next(error);
  }
}

module.exports = {
  create,
};

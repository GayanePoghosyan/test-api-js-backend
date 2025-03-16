const logger = require("../../../services/logger.service")(module);
const { CREATED } = require("../../../constants/http-codes");
const { Company, Contact } = require("../../../DB/models");
const { parseOne } = require("../companies.service");
const { NotFound } = require("../../../constants/errors");

async function create(req, res, next) {
  try {
    logger.init("create company");

    const companyData = {
      name: req.body.name,
      shortName: req.body.shortName,
      businessEntity: req.body.businessEntity,
      address: req.body.address,
      contract: req.body.contract,
      type: req.body.type,
      status: req.body.status || 'active',
      contactId: req.body.contactId
    };

    const contact = await Contact.findByPk(companyData.contactId);
    if (!contact) {
      throw new NotFound("Contact not found");
    }

    const company = await Company.create(companyData);

    res.status(CREATED).json(parseOne(company));
    logger.success();
  } catch (error) {
    logger.error("create company error:", error.message);
    next(error);
  }
}

module.exports = {
  create,
};

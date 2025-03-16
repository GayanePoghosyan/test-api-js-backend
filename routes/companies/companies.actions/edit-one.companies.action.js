const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const { NotFound } = require("../../../constants/errors");
const { Company, Contact } = require("../../../DB/models");
const { parseOne } = require("../companies.service");
const { getUrlForRequest } = require("../../../helpers/url.helper");


async function editOne(req, res, next) {
  try {
    logger.init("edit company");
    const { id } = req.params;
    const data = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      throw new NotFound("Company not found");
    }

    if (data.contactId) {
      const contact = await Contact.findByPk(data.contactId);
      if (!contact) {
        throw new NotFound("Contact not found");
      }
    }

    await company.update(data);
    await company.reload();

    const photoUrl = getUrlForRequest(req);
    res.status(OK).json(parseOne(company, photoUrl));
    logger.success();
  } catch (error) {
    logger.error("edit company error:", error.message);
    next(error);
  }
}

module.exports = {
  editOne,
};

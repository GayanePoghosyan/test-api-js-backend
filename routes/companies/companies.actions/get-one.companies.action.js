const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const { Company, Contact } = require("../../../DB/models");
const { getUrlForRequest } = require("../../../helpers/url.helper");
const { NotFound } = require("../../../constants/errors");
const { parseOne } = require("../companies.service");
const { send } = require("../../../services/response.service");

async function getOne(req, res, next) {
  try {
    logger.init("get company");
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      include: [{
        model: Contact,
        as: 'contact',
        required: false
      }],
    });

    if (!company) {
      throw new NotFound("Company not found");
    }

    const photoUrl = getUrlForRequest(req);
    const result = parseOne(company, photoUrl);

    send(OK, res, result, "Company retrieved successfully");
    logger.success();
  } catch (error) {
    logger.error("get company error:", error.message);
    next(error);
  }
}

module.exports = {
  getOne,
};

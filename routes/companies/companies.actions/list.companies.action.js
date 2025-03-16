const { Op } = require('sequelize');
const logger = require("../../../services/logger.service")(module);
const { Company } = require("../../../DB/models");
const { sendPaginated } = require('../../../services/response.service');

async function list(req, res, next) {
  try {
    logger.init("list companies");
    const {
      status,
      type,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = { [Op.contains]: [type] };

    const companies = await Company.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    sendPaginated(res, companies.rows, companies.count, parseInt(page), parseInt(limit));
    logger.success();

  } catch (error) {
    logger.error("list companies error:", error.message);
    next(error);
  }
}

module.exports = {
  list,
};

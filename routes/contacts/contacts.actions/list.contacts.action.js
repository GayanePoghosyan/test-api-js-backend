const logger = require("../../../services/logger.service")(module);
const { Contact } = require("../../../DB/models");
const { sendPaginated } = require("../../../services/response.service");

async function list(req, res, next) {
  try {
    logger.init("list contacts");
    const {
      page = 1,
      limit = 10,
      sortBy = 'lastName',
      sortOrder = 'ASC'
    } = req.query;

    const contacts = await Contact.findAndCountAll({
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    sendPaginated(res, contacts.rows, contacts.count, parseInt(page), parseInt(limit));
    logger.success();
  } catch (error) {
    logger.error("list contacts error:", error.message);
    next(error);
  }
}

module.exports = {
  list,
};

const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const { Company } = require("../../../DB/models");
const { NotFound } = require("../../../constants/errors");
const { send } = require("../../../services/response.service");

async function deleteOne(req, res, next) {
    try {
        const { id } = req.params;

        const company = await Company.findByPk(id);
        if (!company) {
            throw new NotFound("Company not found");
        }

        await company.destroy();

        send(OK, res, null, "Company deleted successfully");
        logger.success();
    } catch (error) {
        logger.error('delete company error:', error.message);
        next(error);
    }
}

module.exports = {
    deleteOne
};
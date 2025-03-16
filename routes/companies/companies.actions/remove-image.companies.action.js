const path = require("path");
const logger = require("../../../services/logger.service")(module);
const { OK } = require("../../../constants/http-codes");
const imagesConfig = require("../../../config").images;
const imageService = require("../../../services/image.service");
const { NotFound } = require("../../../constants/errors");
const { Company } = require("../../../DB/models");

async function removeImage(req, res, next) {
  try {
    logger.init("remove company image");
    const { id } = req.params;
    const { id: userId } = req.payload;
    const { image_name: fileName } = req.query;

    const company = await Company.findByPk(id);
    if (!company) {
      throw new NotFound("Company not found");
    }

    const filePath = path.resolve(
      `${imagesConfig.uploadsDir}/${userId}/${fileName}`
    );
    await imageService.removeImage(filePath);

    const fileExtension = path.extname(fileName).toLowerCase();
    const _fileName = fileName.split(".").slice(0, -1).join(".");
    const thumbName = `${_fileName}_${imagesConfig.thumbSize}x${imagesConfig.thumbSize}${fileExtension}`;
    const thumbPath = path.resolve(
      `${imagesConfig.uploadsDir}/${userId}/${thumbName}`
    );
    await imageService.removeImage(thumbPath);


    const currentPhotos = company.photos || [];
    const updatedPhotos = currentPhotos.filter(photo => photo.name !== fileName);
    await company.update({ photos: updatedPhotos });

    res.status(OK).json();
    logger.success();
  } catch (error) {
    logger.error("remove company image error:", error.message);
    next(error);
  }
}

module.exports = {
  removeImage,
};

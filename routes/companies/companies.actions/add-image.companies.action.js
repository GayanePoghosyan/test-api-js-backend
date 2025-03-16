const crypto = require("crypto");
const path = require("path");
const logger = require("../../../services/logger.service")(module);
const { getFileUrl } = require("../../../helpers/url.helper");
const { OK } = require("../../../constants/http-codes");
const imagesConfig = require("../../../config").images;
const imageService = require("../../../services/image.service");
const { Company } = require("../../../DB/models");
const { NotFound } = require("../../../constants/errors");
const { send } = require("../../../services/response.service");


async function addImage(req, res, next) {
  try {
    logger.init("add company image");
    const { id } = req.params;
    const file = req.files.file[0];
    const { id: userId } = req.payload;

    const company = await Company.findByPk(id);
    if (!company) {
      throw new NotFound("Company not found");
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = crypto.randomBytes(10).toString("hex");

    const uploadedFileName = fileName + fileExtension;
    const uploadedFileThumbName = `${fileName}_${imagesConfig.thumbSize}x${imagesConfig.thumbSize}${fileExtension}`;

    const tempFilePath = file.path;
    const targetFilePath = path.resolve(
      `${imagesConfig.uploadsDir}/${userId}/${uploadedFileName}`
    );
    const targetThumbPath = path.resolve(
      `${imagesConfig.uploadsDir}/${userId}/${uploadedFileThumbName}`
    );

    await imageService.resizeImage(tempFilePath, targetThumbPath);
    await imageService.renameImage(tempFilePath, targetFilePath);

    const uploadedImage = {
      name: uploadedFileName,
      filepath: getFileUrl(req, uploadedFileName),
      thumbpath: getFileUrl(req, uploadedFileThumbName),
    };


    const currentPhotos = company.photos || [];
    await company.update({
      photos: [...currentPhotos, uploadedImage]
    });

    send(OK, res, uploadedImage, 'Image added successfully');
    logger.success();
  } catch (error) {
    logger.error("add company image error:", error.message);
    next(error);
  }
}

module.exports = {
  addImage,
};

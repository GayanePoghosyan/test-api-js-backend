const multer = require("multer");
const { Router } = require("express");
const actions = require("./companies.actions");
const validator = require("./companies.validator");
const config = require("../../config");

const fileHandler = multer({ dest: config.images.uploadsDir });

module.exports = Router()
  .post("/companies", ...validator.createCompany, actions.create)
  .get("/companies", ...validator.listCompanies, actions.list)
  .get("/companies/:id", ...validator.getOne, actions.getOne)
  .patch("/companies/:id", ...validator.editOne, actions.editOne)
  .post(
    "/companies/:id/image",
    fileHandler.fields([{ name: "file", maxCount: 1 }]),
    ...validator.addImage,
    actions.addImage
  )
  .delete(
    "/companies/:id",
    ...validator.deleteOne,
    actions.deleteOne
  )
  .delete(
    "/companies/:id/image",
    ...validator.removeImage,
    actions.removeImage
  );

const path = require("path");
const { body, check, query } = require("express-validator");
const { UnprocessableEntity } = require("../../constants/errors");
const validate = require("../../middleware/validation.middleware");
const logger = require("../../services/logger.service")(module);
const imageService = require("../../services/image.service");

const getOne = [
  check("id")
    .isNumeric()
    .withMessage({
      code: UnprocessableEntity,
      message: "id: parameter has incorrect format",
    }),
  validate,
];


const addImage = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  body()
    .custom((_, { req }) => req.files?.file[0])
    .withMessage({
      code: UnprocessableEntity,
      message: "file: parameter is required",
    })
    .bail()
    .custom(async (_, { req }) => {
      const file = req.files.file[0];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const tempFilePath = file.path;

      const isAllowedExtension = [".png", ".jpg", ".jpeg", ".gif"].includes(
        fileExtension
      );
      if (!isAllowedExtension) {
        await imageService
          .removeImage(tempFilePath)
          .catch((err) => logger.error(err));
      }
      return isAllowedExtension;
    })
    .withMessage({
      code: UnprocessableEntity,
      message: "files.file: only image files are allowed to upload",
    }),
  validate,
];

const removeImage = [
  check("id").isNumeric().withMessage({
    code: UnprocessableEntity,
    message: "id: parameter has incorrect format",
  }),
  check("image_name")
    .notEmpty()
    .withMessage((_, { path }) => ({
      code: UnprocessableEntity,
      message: `${path}: parameter is required`,
    })),
  validate,
];

const createCompany = [
  body('name')
    .notEmpty()
    .withMessage({
      code: UnprocessableEntity,
      message: "name: parameter is required"
    })
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "name: must be a string"
    }),
  body('shortName')
    .optional()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "shortName: must be a string"
    }),
  body('businessEntity')
    .notEmpty()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "businessEntity: must be a string"
    }),
  body('address')
    .notEmpty()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "address: must be a string"
    }),
  body('contract')
    .optional()
    .isObject()
    .withMessage({
      code: UnprocessableEntity,
      message: "contract: must be an object"
    })
    .custom((value) => {
      if (value && (!value.no || !value.issue_date)) {
        throw new Error('Contract must contain no and issue_date fields');
      }
      return true;
    })
    .withMessage({
      code: UnprocessableEntity,
      message: "contract: must contain no and issue_date fields"
    }),
  body('type')
    .notEmpty()
    .isArray()
    .withMessage({
      code: UnprocessableEntity,
      message: "type: must be an array"
    })
    .custom(value => value.every(type => ['agent', 'contractor'].includes(type)))
    .withMessage({
      code: UnprocessableEntity,
      message: "type: each element must be either 'agent' or 'contractor'"
    }),
  body('status')
    .notEmpty()
    .isIn(['active', 'inactive'])
    .withMessage({
      code: UnprocessableEntity,
      message: "status: must be either 'active' or 'inactive'"
    }),
  body('contactId')
    .optional()
    .isInt({ min: 1 })
    .withMessage({
      code: UnprocessableEntity,
      message: "contactId: must be a positive integer"
    }),
  validate,
];

const listCompanies = [
  query('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage({
      code: UnprocessableEntity,
      message: "status: must be either 'active' or 'inactive'"
    }),
  query('type')
    .optional()
    .isIn(['agent', 'contractor'])
    .withMessage({
      code: UnprocessableEntity,
      message: "type: must be either 'agent' or 'contractor'"
    }),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage({
      code: UnprocessableEntity,
      message: "page: must be a positive integer"
    }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage({
      code: UnprocessableEntity,
      message: "limit: must be between 1 and 100"
    }),
  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt'])
    .withMessage({
      code: UnprocessableEntity,
      message: "sortBy: must be either 'name' or 'createdAt'"
    }),
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage({
      code: UnprocessableEntity,
      message: "sortOrder: must be either 'ASC' or 'DESC'"
    }),
  validate,
];

const editOne = [
  check("id")
    .isNumeric()
    .withMessage({
      code: UnprocessableEntity,
      message: "id: parameter has incorrect format",
    }),
  body('name')
    .optional()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "name: must be a string"
    }),
  body('shortName')
    .optional()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "shortName: must be a string"
    }),
  body('businessEntity')
    .optional()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "businessEntity: must be a string"
    }),
  body('address')
    .optional()
    .isString()
    .withMessage({
      code: UnprocessableEntity,
      message: "address: must be a string"
    }),
  body('contract')
    .optional()
    .isObject()
    .withMessage({
      code: UnprocessableEntity,
      message: "contract: must be an object"
    })
    .custom((value) => {
      if (value && (!value.no || !value.issue_date)) {
        throw new Error('Contract must contain no and issue_date fields');
      }
      return true;
    })
    .withMessage({
      code: UnprocessableEntity,
      message: "contract: must contain no and issue_date fields"
    }),
  body('type')
    .optional()
    .isArray()
    .withMessage({
      code: UnprocessableEntity,
      message: "type: must be an array"
    })
    .custom(value => !value || value.every(type => ['agent', 'contractor'].includes(type)))
    .withMessage({
      code: UnprocessableEntity,
      message: "type: each element must be either 'agent' or 'contractor'"
    }),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage({
      code: UnprocessableEntity,
      message: "status: must be either 'active' or 'inactive'"
    }),
  body('contactId')
    .optional()
    .isInt({ min: 1 })
    .withMessage({
      code: UnprocessableEntity,
      message: "contactId: must be a positive integer"
    }),
  validate,
]

const deleteOne = [
  check("id")
    .isNumeric()
    .withMessage({
      code: UnprocessableEntity,
      message: "id: parameter has incorrect format",
    }),
  validate,
]


module.exports = { getOne, deleteOne, addImage, removeImage, createCompany, listCompanies, editOne };

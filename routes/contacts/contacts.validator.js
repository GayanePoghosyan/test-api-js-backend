const { check, body, query } = require("express-validator");
const { UnprocessableEntity } = require("../../constants/errors");
const validate = require("../../middleware/validation.middleware");

const getOne = [
  check("id")
    .isNumeric()
    .withMessage({
      code: UnprocessableEntity,
      message: "id: parameter has incorrect format",
    }),
  validate,
];

const createContact = [
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string')
    .trim(),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string')
    .trim(),
  body('middleName')
    .optional()
    .isString()
    .withMessage('Middle name must be a string')
    .trim(),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.\0-9]*$/)
    .withMessage('Invalid phone number format')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  validate
];

const editOne = [
  body('lastName')
    .optional()
    .isString()
    .withMessage('Last name must be a string')
    .trim(),
  body('firstName')
    .optional()
    .isString()
    .withMessage('First name must be a string')
    .trim(),
  body('middleName')
    .optional()
    .isString()
    .withMessage('Middle name must be a string')
    .trim(),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .withMessage('Invalid phone number format')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage({
      code: UnprocessableEntity,
      message: 'Invalid email address'
    })
    .normalizeEmail(),
  validate
];

const listContacts = [
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
    .isIn(['lastName', 'firstName', 'createdAt'])
    .withMessage({
      code: UnprocessableEntity,
      message: "sortBy: must be one of 'lastName', 'firstName', or 'createdAt'"
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

const deleteOne = [
  check("id")
    .isNumeric()
    .withMessage({
      code: UnprocessableEntity,
      message: "id: parameter has incorrect format",
    }),
  validate,
];

module.exports = { getOne, createContact, editOne, listContacts, deleteOne };

const { body } = require('express-validator');

const contactRules = [
  body('visitorName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters')
    .escape(),
  body('visitorEmail')
    .isEmail()
    .withMessage('Invalid email format')
  body('message')
    .trim()
    .isLength({ min: 3, max: 10000 })
    .withMessage('Message must be between 10-5000 characters')
    .escape()
];

module.exports = { contactRules };

const validator = require('validator');
const ValidationError = require('../errors/ValidationError');

const checkURL = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new ValidationError('Некорректная ссылка');
};

module.exports = checkURL;

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const INTERNAL_ERROR = 500;

module.exports.ERROR_CODE = ERROR_CODE;
module.exports.NOT_FOUND = NOT_FOUND;
module.exports.INTERNAL_ERROR = INTERNAL_ERROR;

module.exports.createError = (res, errorCode = INTERNAL_ERROR, message = 'Произошла ошибка') => res.status(errorCode).send({ message });

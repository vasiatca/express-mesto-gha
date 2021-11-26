const User = require('../models/users');

const {
  ERROR_CODE, NOT_FOUND, createError,
} = require('../const');

module.exports.findUsers = (req, res) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => createError(res));

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Ошибка при создании пользователя');
      } else {
        createError(res);
      }
    });
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Error') {
        createError(res, NOT_FOUND, err.message);
      } else if (err.name === 'CastError') {
        createError(res, ERROR_CODE, 'Неверно указан id пользователя');
      } else {
        createError(res);
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Error') {
        createError(res, NOT_FOUND, err.message);
      } else if (err.name === 'CastError') {
        createError(res, ERROR_CODE, 'Неверно указан id пользователя');
      } else if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Ошибка при обновлении пользователя');
      } else {
        createError(res);
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Error') {
        createError(res, NOT_FOUND, err.message);
      } else if (err.name === 'CastError') {
        createError(res, ERROR_CODE, 'Неверно указан id пользователя');
      } else if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Ошибка при обновлении аватара');
      } else {
        createError(res);
      }
    });
};

const User = require('../models/users');

const {
  ERROR_CODE, NOT_FOUND, createError,
} = require('../const');

module.exports.findUsers = (req, res) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => createError(res));

module.exports.findUserById = (req, res) => User.findById(req.params.userId)
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' }));

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
          break;
        default:
          createError(res);
          break;
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          createError(res, ERROR_CODE, 'Переданы некорректные данные при обновлении профиля');
          break;
        case 'CastError':
          createError(res, NOT_FOUND, 'Пользователь с указанным _id не найден');
          break;
        default:
          createError(res);
          break;
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    createError(res, ERROR_CODE, 'Переданы некорректные данные при обновлении профиля');
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          createError(res, NOT_FOUND, 'Пользователь с указанным _id не найден');
          break;
        default:
          createError(res);
          break;
      }
    });
};

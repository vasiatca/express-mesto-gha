const User = require('../models/users');

const {
  ERROR_CODE, NOT_FOUND, createError,
} = require('../const');

module.exports.findUsers = (req, res) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => createError(res));

module.exports.findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        createError(res, NOT_FOUND, 'Пользователь с указанным _id не найден');
      } else {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, NOT_FOUND, 'Пользователь с указанным _id не найден');
      }
      if (err.name === 'CastError') {
        createError(res, ERROR_CODE, 'Пользователь с указанным _id не найден');
      } else {
        createError(res);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Переданы некорректные данные при создании пользователя');
      } else {
        createError(res);
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Переданы некорректные данные при обновлении профиля');
      }
      if (err.name === 'CastError') {
        createError(res, NOT_FOUND, 'Пользователь с указанным _id не найден');
      } else {
        createError(res);
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    createError(res, ERROR_CODE, 'Переданы некорректные данные при обновлении аватара');
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        createError(res, NOT_FOUND, 'Пользователь с указанным _id не найден');
      } else {
        createError(res);
      }
    });
};

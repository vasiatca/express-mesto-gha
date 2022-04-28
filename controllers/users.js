const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const CastError = require('../errors/CastError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.findUsers = (req, res, next) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((u) => {
      if (u) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => res.status(201).send({
          _id: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          about: user.about,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError('Ошибка при создании пользователя'));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '7d' });

      res.send({ token });

      // res.cookie('jwt', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true,
      //   sameSite: true,
      // })
      //   .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неверно указан id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.findMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка при обновлении пользователя'));
      }
      next(err);
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка при обновлении аватара'));
      }
      next(err);
    });
};

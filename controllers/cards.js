const Card = require('../models/cards');

const {
  ERROR_CODE, NOT_FOUND, createError,
} = require('../const');

module.exports.findCards = (req, res) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => createError(res));

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Ошибка при создании карточки');
      } else {
        createError(res);
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Error') {
        createError(res, NOT_FOUND, err.message);
      } else if (err.name === 'CastError') {
        createError(res, ERROR_CODE, 'Неверно указан id карточки');
      } else {
        createError(res);
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('Карточка не найдена'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'Error') {
      createError(res, NOT_FOUND, err.message);
    } else if (err.name === 'CastError') {
      createError(res, ERROR_CODE, 'Неверно указан id карточки');
    } else if (err.name === 'ValidationError') {
      createError(res, ERROR_CODE, 'Переданы некорректные данные для постановки/снятии лайка');
    } else {
      createError(res);
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('Карточка не найдена'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'Error') {
      createError(res, NOT_FOUND, err.message);
    } else if (err.name === 'CastError') {
      createError(res, ERROR_CODE, 'Неверно указан id карточки');
    } else if (err.name === 'ValidationError') {
      createError(res, ERROR_CODE, 'Переданы некорректные данные для постановки/снятии лайка');
    } else {
      createError(res);
    }
  });

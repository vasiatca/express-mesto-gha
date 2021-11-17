const Card = require('../models/cards');

const {
  ERROR_CODE, NOT_FOUND, createError,
} = require('../const');

module.exports.findCards = (req, res) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => createError(res));

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        createError(res, NOT_FOUND, 'Карточка по указанному _id не найдена.');
      } else {
        res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, NOT_FOUND, 'Карточка с указанным _id не найдена');
      }
      if (err.name === 'CastError') {
        createError(res, ERROR_CODE, 'Карточка с указанным _id не найдена');
      } else {
        createError(res);
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        createError(res, ERROR_CODE, 'Переданы некорректные данные при создании карточки');
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
  .then((card) => {
    if (!card) {
      createError(res, NOT_FOUND, 'Карточка по указанному _id не найдена.');
    } else {
      res.send({ data: card })
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
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
  .then((card) => {
    if (!card) {
      createError(res, NOT_FOUND, 'Карточка по указанному _id не найдена.');
    } else {
      res.send({ data: card })
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      createError(res, ERROR_CODE, 'Переданы некорректные данные для постановки/снятии лайка');
    } else {
      createError(res);
    }
  });

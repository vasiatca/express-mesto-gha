const Card = require('../models/cards');

const {
  ERROR_CODE, NOT_FOUND, createError,
} = require('../const');

module.exports.findCards = (req, res) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => createError(res));

module.exports.deleteCardById = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.send({ data: card }))
  .catch(() => createError(res, NOT_FOUND, 'Карточка с указанным _id не найдена'));

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          createError(res, ERROR_CODE, 'Переданы некорректные данные при создании карточки');
          break;
        default:
          createError(res);
          break;
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    switch (err.name) {
      case 'CastError':
        createError(res, ERROR_CODE, 'Переданы некорректные данные для постановки/снятии лайка');
        break;
      default:
        createError(res);
        break;
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    switch (err.name) {
      case 'CastError':
        createError(res, ERROR_CODE, 'Переданы некорректные данные для постановки/снятии лайка');
        break;
      default:
        createError(res);
        break;
    }
  });

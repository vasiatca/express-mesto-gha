const Card = require('../models/cards');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

module.exports.findCards = (req, res, next) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return card.remove()
        .then(() => res.send({ message: `Карточка с id ${card.id} успешно удалена!` }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Неверно указан id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Карточка не найдена'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Неверно указан id карточки'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => new NotFoundError('Карточка не найдена'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new CastError('Неверно указан id карточки'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
    } else {
      next(err);
    }
  });

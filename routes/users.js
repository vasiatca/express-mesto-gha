const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const checkURL = require('../utils/checkURL');

const {
  findUsers, findUserById, findMyUser, editUser, editUserAvatar,
} = require('../controllers/users');

router.get('/', findUsers);
router.get('/me', findMyUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(checkURL),
  }).unknown(true),
}), editUserAvatar);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), findUserById);

module.exports = router;

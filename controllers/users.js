const User = require('../models/user');
const {
  NotFoundError,
  BadRequestError,
} = require('../middlewares/errors');

function getUser(req, res, next) {
  User.findById(req.user._id)
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь по указанному id не найден');
      } else {
        next(err);
      }
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
}
module.exports = {
  getUser,
  updateUser,
};

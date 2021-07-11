/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  NotFoundError,
  BadRequestError,
  ValidationError,
  DuplicateEmailError,
  UnauthorizedError,
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
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, {
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

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send(
      {
        name: user.name, _id: user._id, email: user.email,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      } else if
      (err.name === 'MongoError') {
        throw new DuplicateEmailError('Пользователь с таким email уже зарегистрирован');
      } else {
        next(err);
      }
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль, невозможно авторизоватся'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль, невозможно авторизоватся'));
          }
          // аутентификация успешна
          // создаем токен
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          // возвращаем токен в куки, срок жизни 7 дней
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            })
            .send({ message: 'Успешный логин' })
            .end();
        });
    })
    .catch(next);
}

function logout(req, res, next) {
  res.clearCookie('jwt');
  return res.send({ message: 'Выполнен выход' });
}

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
  logout,
};

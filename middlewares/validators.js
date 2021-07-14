const { celebrate, Joi } = require('celebrate');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }).unknown(true),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
});

const validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(new RegExp(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)),
    trailer: Joi.string().required().pattern(new RegExp(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)),
    thumbnail: Joi.string().required().pattern(new RegExp(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateAuthentication,
  validateUpdateUserProfile,
  validateCardBody,
  validateMovieId,
};

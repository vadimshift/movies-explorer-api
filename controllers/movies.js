const Movie = require('../models/movie');
const {
  NotFoundError,
  RuleError,
  BadRequestError,
} = require('../middlewares/errors');

function getMovies(req, res, next) {
  Movie.find({})
    .then((data) => res.send(data))
    .catch(next);
}

function delMovie(req, res, next) {
  const currentUser = req.user._id; // id текущего пользователя
  const { movieId } = req.params; // id карточки из запроса
  Movie.findById(movieId)
    .then((movie) => {
      const movieOwner = movie.owner.toString();
      if (currentUser !== movieOwner) {
        next(new RuleError('Нет прав на удаление данного фильма'));
      } else {
        return movie.remove().then(() => res.send({ data: movie }));
      }
    })
    .catch(() => next(new NotFoundError('Фильм с указанным _id не найден')))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

module.exports = {
  getMovies,
  delMovie,
  createMovie,
};

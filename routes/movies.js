const router = require('express').Router();
const {
  getMovies,
  delMovie,
  createMovie,
} = require('../controllers/movies');
const { validateMovieId, validateCardBody } = require('../middlewares/validators');

router.get('/movies', getMovies);
router.delete('/movies/:movieId', validateMovieId, delMovie);
router.post('/movies', validateCardBody, createMovie);

module.exports = router;

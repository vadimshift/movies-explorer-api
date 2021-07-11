const router = require('express').Router();
const {
  getMovies,
  delMovie,
  createMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.delete('/movies/:movieId', delMovie);
router.post('/movies', createMovie);

module.exports = router;

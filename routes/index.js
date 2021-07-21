const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const auth = require('../middlewares/auth');
const { validateUserBody, validateAuthentication } = require('../middlewares/validators');
const {
  createUser,
  login,
} = require('../controllers/users');
const { NotFoundError } = require('../middlewares/errors');

router.post('/signin', validateAuthentication, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use(userRoutes);
router.use(movieRoutes);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;

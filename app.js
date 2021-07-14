require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const { validateUserBody, validateAuthentication } = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser,
  login,
} = require('./controllers/users');
const { NotFoundError } = require('./middlewares/errors');
const processingErrors = require('./middlewares/processingErrors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(requestLogger); // подключение логгера запросов

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 200,
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const whitelist = [
  'http://api.vadim.movies-explorer.nomoredomains.rocks',
  'https://api.vadim.movies-explorer.nomoredomains.rocks',
  'http://localhost:3000',
  'http://localhost:3001'];
const corsOptions = {
  origin: whitelist,
  credentials: true,
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));


app.post('/signin', validateAuthentication, login);
app.post('/signup', validateUserBody, createUser);

app.use(auth);

app.use(userRoutes);
app.use(movieRoutes);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключение логгера ошибок
app.use(errors()); // ошибки celebrate
app.use(processingErrors); // обработка ошибок
app.listen(PORT);

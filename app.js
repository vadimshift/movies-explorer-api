require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const processingErrors = require('./middlewares/processingErrors');

const app = express();

app.use(requestLogger); // подключение логгера запросов

// подключаемся к серверу mongo
mongoose.connect(process.env.DB_CONN, {
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

app.use(router); // подключение маршрутов

app.use(errorLogger); // подключение логгера ошибок
app.use(errors()); // ошибки celebrate
app.use(processingErrors); // обработка ошибок
app.listen(process.env.PORT);

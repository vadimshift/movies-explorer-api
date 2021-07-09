const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(requestLogger); // подключение логгера запросов
app.use(errorLogger); // подключение логгера ошибок

app.listen(PORT);

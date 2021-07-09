const express = require('express');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(requestLogger); // подключение логгера запросов
app.use(errorLogger); // подключение логгера ошибок

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require("helmet");
const { limiter } = require("./middlewares/limiter");
const router = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const processingErrors = require("./middlewares/processingErrors");

const { NODE_ENV, DB_CONN, PORT } = process.env;

const corsOptions = {
  origin: [
    "https://vadim.movies-explorer.nomoredomains.rocks",
    "http://localhost:3000",
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "origin", "Authorization", "Accept"],
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(requestLogger); // подключение логгера запросов

// подключаемся к серверу mongo
mongoose.connect(
  NODE_ENV === "production" ? DB_CONN : "mongodb://localhost:27017/bitfilmsdb",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());

app.use(router); // подключение маршрутов

app.use(errorLogger); // подключение логгера ошибок
app.use(errors()); // ошибки celebrate
app.use(processingErrors); // обработка ошибок
app.listen(NODE_ENV === "production" ? PORT : "3000");

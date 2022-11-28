const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const config = require("./utils/config");
const logger = require("./utils/logger");
const {
  errorHandler,
  getTokenFrom,
  userExtractor,
} = require("./utils/middleware");

logger.info("connecting to database ...");
mongoose.connect(config.mongoUrl);

app.use(cors());
app.use(express.json());
app.use(getTokenFrom);
app.use(userExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(errorHandler);

module.exports = app;

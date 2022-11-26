const config = require("./utils/config");
const logger = require("./utils/logger");

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("connected to database");
  server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
});

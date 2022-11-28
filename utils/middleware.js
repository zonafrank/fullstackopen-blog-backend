const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "jsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  logger.error(error.message);

  next(error);
};

const getTokenFrom = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = (request, response, next) => {
  const token = request.token;
  const decodedToken = token ? jwt.verify(token, process.env.SECRET) : null;
  request.user = decodedToken ? decodedToken : {};
  next();
};

module.exports = {
  errorHandler,
  getTokenFrom,
  userExtractor,
};

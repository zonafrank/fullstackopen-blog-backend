if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoUrl = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003;

module.exports = { mongoUrl, PORT };

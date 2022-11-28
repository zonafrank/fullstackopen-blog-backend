const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  if (!(username.trim() && password.trim())) {
    return response
      .status(400)
      .json({ error: "your must provide username and password" });
  }

  if (username.trim().length < 3) {
    return response
      .status(400)
      .json({ error: "username length must be 3 or more" });
  }

  if (password.trim().length < 8) {
    return response
      .status(400)
      .json({ error: "password length must be 8 or more" });
  }

  const { username, name, password } = request.body;
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    username,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;

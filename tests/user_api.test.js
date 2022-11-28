const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { usersInDB } = require("../utils/list_helper");

const api = supertest(app);

describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({ username: "root", name: "Admin", passwordHash });
    await user.save();
  }, 10000);

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDB();
    const newUser = {
      name: "John Doe",
      username: "jdoe",
      password: "password",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with appropriate status code if username already exists on the database", async () => {
    const usersAtStart = await usersInDB();
    const newUser = { username: "root", name: "Admin", password: "password" };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toContain("username must be unique");

    const usersAtEnd = await usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

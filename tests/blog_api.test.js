const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { blogs: initialBlogs, blogsInDB } = require("../utils/list_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);
const timeOut = 15000;
let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  const user = await User.findOne({ username: "root" });
  for (let blog of initialBlogs) {
    blog.user = user._id;
    let blogObject = new Blog(blog);
    await blogObject.save();
  }

  const userLoginDetails = {
    username: "root",
    password: "password",
  };
  const response = await api.post("/api/login").send(userLoginDetails);
  token = `Bearer ${response.body.token}`;
}, timeOut);

test(
  "blogs are returned as json",
  async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  },
  timeOut
);

test(
  "the correct number of blogs is returned",
  async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(6);
  },
  timeOut
);

test(
  "a valid blog can be added",
  async () => {
    const initialBlogs = await blogsInDB();
    const blogObj = {
      author: "John Doe",
      title: "The origin of mankind",
      url: "http://johndoe.com/the-origin-of-mankind",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .send(blogObj)
      .set({ Authorization: token })
      .expect(201);
    const notesAtEnd = await blogsInDB();
    const contents = notesAtEnd.map((n) => n.title);
    expect(notesAtEnd).toHaveLength(initialBlogs.length + 1);
    expect(contents).toContain("The origin of mankind");
  },
  timeOut
);

test(
  "a blog added without likes gets the likes set to zero",
  async () => {
    const blogObj = {
      author: "John Doe",
      title: "The origin of mankind",
      url: "http://johndoe.com/the-origin-of-mankind",
    };

    const response = await api
      .post("/api/blogs")
      .send(blogObj)
      .set({ Authorization: token });
    expect(response.body.likes).toBe(0);
  },
  timeOut
);

test(
  "an attempt to add a blog with missing title fails",
  async () => {
    const blogObj = {
      author: "John Doe",
      url: "http://johndoe.com/the-origin-of-mankind",
    };
    console.log({ token });
    await api
      .post("/api/blogs")
      .send(blogObj)
      .set({ Authorization: token })
      .expect(400);
    const blogsAtEnd = await blogsInDB();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  },
  timeOut
);

test(
  "an attempt to add a blog with missing url fails",
  async () => {
    const blogObj = {
      author: "John Doe",
      title: "The origin of mankind",
    };

    await api
      .post("/api/blogs")
      .send(blogObj)
      .set({ Authorization: token })
      .expect(400);
    const blogsAtEnd = await blogsInDB();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  },
  timeOut
);

test(
  "a note with a valid id can be deleted",
  async () => {
    const blogsAtStart = await blogsInDB();
    const firstBlog = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${firstBlog._id.toString()}`)
      .set({ Authorization: token })
      .expect(204);
    const blogsAtEnd = await blogsInDB();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  },
  timeOut
);

test(
  "a test with a valid id can be updated",
  async () => {
    const blogsAtStart = await blogsInDB();
    const { author, title, url, likes, _id } = blogsAtStart[0];
    const updateObject = { author, title, url, likes: likes + 1 };
    await api
      .put(`/api/blogs/${_id.toString()}`)
      .send(updateObject)
      .expect(200);
    const blogsAtEnd = await blogsInDB();
    expect(blogsAtEnd[0].likes).toBe(likes + 1);
  },
  timeOut
);

afterAll(() => {
  mongoose.connection.close();
});

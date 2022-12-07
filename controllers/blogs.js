const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const foundBlog = await Blog.findById(request.params.id);
  if (foundBlog) {
    response.json(foundBlog);
  } else {
    response.status(400).json({ error: "invalid id" });
  }
});

blogsRouter.post("/", async (request, response) => {
  const { body, user, token } = request;

  if (!token) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blog = new Blog({ ...body, user: user.id });
  const savedBlog = await blog.save();
  const userInDB = await User.findById(user.id);
  userInDB.blogs = userInDB.blogs.concat(savedBlog._id);
  await userInDB.save();
  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
    runValidators: true
  }).populate("user", { username: 1, name: 1 });
  response.json(updatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const { body } = request;
  const blogToUpdate = await Blog.findById(request.params.id);

  if (!blogToUpdate.comments) {
    blogToUpdate.comments = [];
  }

  blogToUpdate.comments.push(body.comment);
  const updatedBlog = await blogToUpdate.save();
  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { user } = request;
  if (!user.id) {
    return response.status(401).json({ error: "invalid user" });
  }

  const { id } = request.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(400).json({ error: "invalid blog id" });
  }

  if (user.id === blog.user.toString()) {
    await Blog.findByIdAndRemove(id);
    const userInDB = await User.findById(user.id);
    userInDB.blogs = userInDB.blogs.filter((b) => b.toString() !== id);
    await userInDB.save();
    return response.status(204).end();
  }

  response
    .status(401)
    .json({ error: "you can only delete a blog that you created" });
});

module.exports = blogsRouter;

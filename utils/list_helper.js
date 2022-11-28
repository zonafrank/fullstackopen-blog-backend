const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const dummy = (blogs) => {
  logger.info(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  const result = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return result;
};

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map((blog) => blog.likes));
  const mostLiked = blogs.filter((blog) => blog.likes === mostLikes);
  const { title, author, likes } = mostLiked[0];
  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const authorBlogs = blogs.reduce((result, blog) => {
    if (result[blog.author]) {
      result[blog.author] += 1;
    } else {
      result[blog.author] = 1;
    }

    return result;
  }, {});

  const authorMostBlogs = { author: null, blogs: 0 };

  for (let author in authorBlogs) {
    if (authorBlogs[author] > authorMostBlogs.blogs) {
      authorMostBlogs.author = author;
      authorMostBlogs.blogs = authorBlogs[author];
    }
  }

  return authorMostBlogs;
};

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((result, blog) => {
    if (result[blog.author]) {
      result[blog.author] += blog.likes;
    } else {
      result[blog.author] = blog.likes;
    }

    return result;
  }, {});

  const authorMostLikes = { author: null, likes: 0 };

  for (let author in authorLikes) {
    if (authorLikes[author] > authorMostLikes.likes) {
      authorMostLikes.author = author;
      authorMostLikes.likes = authorLikes[author];
    }
  }

  return authorMostLikes;
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs;
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  dummy,
  blogs,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDB,
  usersInDB,
};

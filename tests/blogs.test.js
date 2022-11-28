const listHelper = require("../utils/list_helper");
const { blogs } = require("../utils/list_helper");
const listWithOneBlog = blogs.slice(0, 1);

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(listWithOneBlog[0].likes);
  });

  test("when list has many blogs, is calulated correctly", () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, is that blog", () => {
    const { title, author, likes } = listWithOneBlog[0];
    const favorite = { title, author, likes };
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual(favorite);
  });

  test("when list has many blogs, is the correct blog", () => {
    const mostLiked = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(mostLiked);
  });
});

describe("author with most blogs", () => {
  test("when list has only one blog, is that author", () => {
    const blog = listWithOneBlog[0];
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({ author: blog.author, blogs: 1 });
  });

  test("when list has many blogs, is the right author with the rignt number of blogs", () => {
    const authorWithMostBlogs = {
      author: "Robert C. Martin",
      blogs: 3,
    };

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(authorWithMostBlogs);
  });
});

describe("author with most likes", () => {
  test("when list has only one blog, is that author", () => {
    const blog = listWithOneBlog[0];
    const result = listHelper.mostLikes(listWithOneBlog);
    expect(result).toEqual({ author: blog.author, likes: blog.likes });
  });

  test("when list has many blogs, is the right author with the rignt number of likes", () => {
    const authorWithMostLikes = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };

    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual(authorWithMostLikes);
  });
});

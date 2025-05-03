import { useState, useEffect } from 'react';
import blogService from '../services/blogs';

const useBlogs = (user) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const createBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog));
    return returnedBlog;
  };

  const updateBlog = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject);
    setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
    return returnedBlog;
  };

  const removeBlog = async (id) => {
    await blogService.remove(id);
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return {
    blogs,
    createBlog,
    updateBlog,
    removeBlog,
  };
};

export default useBlogs;

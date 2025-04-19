const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  if (!request.user) {
    return response.status(401).json({ error: 'user not found' })
  }

  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.user._id
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
    }
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    if (!request.user) {
      return response.status(401).json({ error: 'user not found' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    const blogUserId = blog.user.toString()
    const tokenUserId = request.user._id.toString()

    if (blogUserId !== tokenUserId) {
      return response.status(403).json({ error: 'not authorized to delete this blog' })
    }

    request.user.blogs = request.user.blogs.filter(b => b.toString() !== blog._id.toString())
    await request.user.save()

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
    }
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter 
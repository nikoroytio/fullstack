const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const userHelper = require('./user_helper')
const blogHelper = require('./blog_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { TEST_USER_USERNAME, TEST_USER_PASSWORD, TEST_USER_NAME } = require('../utils/config')

const api = supertest(app)

let token

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

describe('when there is initially one user and some blogs in db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create test user
    const user = new User({
      username: TEST_USER_USERNAME,
      name: TEST_USER_NAME,
      password: TEST_USER_PASSWORD
    })
    await user.save()

    // Login to get token
    const response = await api
      .post('/api/login')
      .send({
        username: TEST_USER_USERNAME,
        password: TEST_USER_PASSWORD
      })
    
    token = response.body.token

    const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
    const promiseArray = blogObjects.map(blog => blog.save())
    const savedBlogs = await Promise.all(promiseArray)
    
    // Add the blogs to the user's blogs array
    user.blogs = savedBlogs.map(blog => blog._id)
    await user.save()
  })

  test('blogs are returned with user information', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    assert.strictEqual(blogs.length, initialBlogs.length)
    
    blogs.forEach(blog => {
      assert(blog.user)
      assert(blog.user.username)
      assert(blog.user.name)
    })
  })

  describe('creating a blog', () => {
    test('succeeds with valid token', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog = response.body
      assert(savedBlog.user)
      assert.strictEqual(savedBlog.user.username, TEST_USER_USERNAME)
      assert.strictEqual(savedBlog.user.name, TEST_USER_NAME)

      // Verify the blog was added to the user's blogs array
      const users = await userHelper.usersInDb()
      const user = users[0]
      assert(user.blogs.some(blogId => blogId.toString() === savedBlog.id))
    })

    test('fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      // Verify the blog was not added
      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })

    test('fails with status code 401 if token is invalid', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalid-token')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      // Verify the blog was not added
      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
  })

  test('users are returned with their blogs', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = response.body
    assert.strictEqual(users.length, 1)
    
    const user = users[0]
    assert.strictEqual(user.blogs.length, initialBlogs.length)
    
    user.blogs.forEach(blog => {
      assert(blog.title)
      assert(blog.author)
      assert(blog.url)
      assert.strictEqual(typeof blog.likes, 'number')
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid and user is creator', async () => {
      // Get the first blog
      const blogsAtStart = await blogHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      // Verify the blog is deleted
      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await blogHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      // Verify the blog is not deleted
      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status code 403 if user is not the creator', async () => {
      // Create a new user
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      // Login as the new user
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'newuser', password: 'password' })
        .expect(200)

      const token = loginResponse.body.token

      // Try to delete a blog created by root
      const blogsAtStart = await blogHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

      // Verify the blog is not deleted
      const blogsAtEnd = await blogHelper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
}) 
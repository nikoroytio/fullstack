const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./user_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ 
      username: 'root', 
      name: 'Superuser',
      passwordHash 
    })
    await user.save()
  })

  test('login succeeds with correct credentials', async () => {
    const loginData = {
      username: 'root',
      password: 'sekret'
    }

    const response = await api
      .post('/api/users/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.token)
    assert.strictEqual(response.body.username, 'root')
    assert.strictEqual(response.body.name, 'Superuser')
  })

  test('login fails with incorrect password', async () => {
    const loginData = {
      username: 'root',
      password: 'wrong'
    }

    const response = await api
      .post('/api/users/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('login fails with non-existent username', async () => {
    const loginData = {
      username: 'nonexistent',
      password: 'sekret'
    }

    const response = await api
      .post('/api/users/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  test('creating a blog fails without token', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('creating a blog succeeds with valid token', async () => {
    // First login to get token
    const loginResponse = await api
      .post('/api/users/login')
      .send({ username: 'root', password: 'sekret' })

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('creating a blog fails with invalid token', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer invalidtoken')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
}) 
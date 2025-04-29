const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./middleware')
const User = require('./models/user')
const bcrypt = require('bcrypt')

mongoose.set('strictQuery', false)

logger.info('Environment:', process.env.NODE_ENV)
logger.info('connecting to', config.MONGODB_URI)

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(async () => {
    logger.info('connected to MongoDB')
    
    // Create root user in all modes
    const rootUser = await User.findOne({ username: config.TEST_USER_USERNAME })
    if (!rootUser) {
      logger.info('Creating root user')
      const passwordHash = await bcrypt.hash(config.TEST_USER_PASSWORD, 10)
      const user = new User({
        username: config.TEST_USER_USERNAME,
        name: config.TEST_USER_NAME,
        passwordHash
      })
      await user.save()
      logger.info('Root user created successfully')
    }
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Middleware
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// Public routes
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Protected routes with user extraction
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

// Testing routes - only in test mode
if (process.env.NODE_ENV === 'test') {
  logger.info('Test mode: Enabling testing routes')
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
} else {
  logger.info('Not in test mode: Testing routes disabled')
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app 
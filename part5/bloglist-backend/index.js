require('dotenv').config()
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

logger.info('Starting server in environment:', process.env.NODE_ENV)
logger.info('Using database:', config.MONGODB_URI)

try {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
      
      app.listen(config.PORT, () => {
        logger.info(`Server running on port ${config.PORT}`)
        logger.info('Testing routes enabled:', process.env.NODE_ENV === 'test')
      })
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
      process.exit(1)
    })
} catch (error) {
  logger.error('Error during server startup:', error)
  process.exit(1)
} 
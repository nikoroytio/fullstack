require('dotenv').config()
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
}) 
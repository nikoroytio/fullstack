const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const logger = require('../utils/logger')

router.post('/reset', async (request, response) => {
  logger.info('Starting database reset...')
  
  try {
    // Delete all blogs
    const deletedBlogs = await Blog.deleteMany({})
    logger.info(`Deleted ${deletedBlogs.deletedCount} blogs`)
    
    // Delete all users
    const deletedUsers = await User.deleteMany({})
    logger.info(`Deleted ${deletedUsers.deletedCount} users`)
    
    // Create root user
    const passwordHash = await bcrypt.hash(config.TEST_USER_PASSWORD, 10)
    const user = new User({
      username: config.TEST_USER_USERNAME,
      name: config.TEST_USER_NAME,
      passwordHash
    })
    await user.save()
    logger.info('Root user recreated successfully')
    
    response.status(204).end()
  } catch (error) {
    logger.error('Error during database reset:', error)
    response.status(500).json({ error: 'Database reset failed' })
  }
})

module.exports = router
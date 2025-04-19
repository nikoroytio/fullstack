const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return next()
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return next()
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return next()
    }

    request.user = user
    next()
  } catch (error) {
    next()
  }
}

module.exports = userExtractor 
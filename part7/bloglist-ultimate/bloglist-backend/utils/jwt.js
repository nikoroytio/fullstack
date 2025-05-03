const jwt = require('jsonwebtoken')
const config = require('./config')

const generateToken = (user) => {
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(userForToken, config.SECRET)
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.SECRET)
  } catch (error) {
    return null
  }
}

module.exports = {
  generateToken,
  verifyToken
} 
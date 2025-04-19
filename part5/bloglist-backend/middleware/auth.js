const { verifyToken } = require('../utils/jwt')
const User = require('../models/user')

const authMiddleware = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    const decodedToken = verifyToken(token)
    
    if (decodedToken) {
      const user = await User.findById(decodedToken.id)
      if (user) {
        request.user = user
        return next()
      }
    }
  }

  return response.status(401).json({ error: 'token missing or invalid' })
}

module.exports = authMiddleware 
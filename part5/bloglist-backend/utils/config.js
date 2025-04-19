require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET || 'your-secret-key'
const TEST_USER_USERNAME = process.env.TEST_USER_USERNAME
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD
const TEST_USER_NAME = process.env.TEST_USER_NAME

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  TEST_USER_USERNAME,
  TEST_USER_PASSWORD,
  TEST_USER_NAME
} 
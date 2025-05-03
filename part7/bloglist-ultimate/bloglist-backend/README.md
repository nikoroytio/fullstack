# Blog List Application

A simple blog list application built with Node.js, Express, and MongoDB. The application allows users to view and create blog posts.

## Project Structure

```
part4/
├── app.js              # Express application setup
├── index.js            # Server startup
├── controllers/        # Route handlers
│   ├── blogs.js        # Blog-related routes
│   ├── login.js        # Login and authentication routes
│   └── users.js        # User-related routes
├── models/             # Database models
│   ├── blog.js         # Blog model
│   └── user.js         # User model
├── middleware/         # Custom middleware
│   ├── auth.js         # Authentication middleware
│   ├── index.js        # Middleware exports
│   ├── tokenExtractor.js # Token extraction middleware
│   └── userExtractor.js # User extraction middleware
├── utils/              # Utility functions
│   ├── config.js       # Configuration
│   ├── jwt.js          # JWT utilities
│   ├── list_helper.js  # Blog list utilities
│   └── logger.js       # Logging
├── tests/              # Test files
│   ├── auth_api.test.js # Authentication tests
│   ├── blog_api.test.js # Blog API tests
│   ├── blog_helper.js  # Blog test helper
│   ├── list_helper.test.js # Blog list tests
│   ├── test_helper.js  # Test utilities
│   ├── test_helper.json # Test data
│   ├── user_api.test.js # User API tests
│   └── user_helper.js  # User test helper
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
└── package-lock.json   # Lock file for dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
MONGODB_URI=your_main_database_url
TEST_MONGODB_URI=your_test_database_url
SECRET=your-secret-key
```

## Running the Application

- Development mode:
```bash
npm run dev
```

- Production mode:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run specific test file:
```bash
npm test tests/blog_api.test.js
```  
  
Run tests sequentically:
```bash
npm test -- --test-concurrency=1
```  

## Features

- RESTful API for blog posts and users
- MongoDB database integration
- Environment-specific configurations
- Comprehensive test suite
- Async/await implementation
- Error handling middleware
- Token-based authentication
- User authorization
- Request logging
- Environment variable management
- JWT-based authentication
- User blog ownership
- Blog list utilities and tests

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Supertest (for testing)
- Cross-env (for environment variables)
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)
- Jest (for testing) 
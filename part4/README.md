# Blog List Application

A simple blog list application built with Node.js, Express, and MongoDB. The application allows users to view and create blog posts.

## Project Structure

```
part4/
├── app.js              # Express application setup
├── index.js            # Server startup
├── controllers/        # Route handlers
│   └── blogs.js        # Blog-related routes
├── models/             # Database models
│   └── blog.js         # Blog model
├── utils/              # Utility functions
│   ├── config.js       # Configuration
│   └── logger.js       # Logging
├── tests/              # Test files
│   ├── blog_api.test.js
│   └── test_helper.js
└── .env                # Environment variables
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

- RESTful API for blog posts
- MongoDB database integration
- Environment-specific configurations
- Comprehensive test suite
- Async/await implementation
- Error handling middleware

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Supertest (for testing)
- Cross-env (for environment variables) 
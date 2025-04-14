# Phonebook Backend

This is the backend for the Phonebook application. It provides a REST API for managing contacts.

## API Endpoints

- GET /api/persons - Get all persons
- GET /api/persons/:id - Get single person
- POST /api/persons - Add new person
- DELETE /api/persons/:id - Delete person
- GET /info - Get phonebook info

## Development

To run the application locally:

```bash
npm install
npm run dev
```

The application will be available at http://localhost:3001

## Deployment

The application is deployed to Fly.io at [https://phonebook-backend-ancient-frost-6313.fly.dev](https://phonebook-backend-ancient-frost-6313.fly.dev)

You can test the API endpoints by appending them to the base URL, for example:
- https://phonebook-backend-ancient-frost-6313.fly.dev/api/persons
- https://phonebook-backend-ancient-frost-6313.fly.dev/info

## Technologies Used

- Node.js
- Express
- Morgan for logging
- CORS for cross-origin requests
- Deployed on Fly.io 
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// Custom token for request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Use morgan with custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// Root route
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1><p>Use the following endpoints:</p><ul><li>GET /api/persons - Get all persons</li><li>GET /api/persons/:id - Get single person</li><li>POST /api/persons - Add new person</li><li>DELETE /api/persons/:id - Delete person</li><li>GET /info - Get phonebook info</li></ul>')
})

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Step 2: Info page
app.get('/info', (request, response) => {
  const currentTime = new Date()
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `
  response.send(info)
})

// Step 1: Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Step 3: Get single person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Step 4: Delete person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

// Step 5 & 6: Add new person with validation
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  // Check if name already exists
  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 
require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const clusterUrl = process.env.CLUSTER_URL

const url = `mongodb+srv://roytioniko:${password}@${clusterUrl}/phonebookApp?retryWrites=true&w=majority`


mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // List all entries
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Add new entry
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid number of arguments')
  console.log('Usage: node mongo.js <password> [name] [number]')
  mongoose.connection.close()
} 
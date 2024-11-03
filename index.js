const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: '1'
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2'
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3'
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4'
  }
]

const add_person = (name, number) => {
  const person = { name, number, id: Math.floor(Math.random() * 100000000).toString() }
  persons.push(person)
  return person
}

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('requestbody', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestbody'))

app.get('/info', (request, response) => {
  return response.send(`<!DOCTYPE html><p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  return response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const idx = persons.findIndex(person => person.id == request.params.id)
  return idx === -1 ? response.status(404).end() : response.json(persons[idx])
})

app.delete('/api/persons/:id', (request, response) => {
  const idx = persons.findIndex(person => person.id == request.params.id)
  if (idx != -1) {
    persons.splice(idx, 1)
  }
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  if (!request.body) {
    return response.status(400).json({ error: 'missing request body' })
  }
  if (!request.body.name) {
    return response.status(400).json({ error: 'missing name' })
  }
  if (!request.body.number) {
    return response.status(400).json({ error: 'missing number' })
  }
  if (persons.findIndex(person => person.name == request.body.name) != -1) {
    return response.status(400).json({ error: 'name is not unique' })
  }
  return response.status(201).json(add_person(request.body.name, request.body.number))
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('requestbody', (req, res) => JSON.stringify(req.body)) // eslint-disable-line no-unused-vars
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestbody'))

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'bad id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get('/info', (request, response) => {
  return Person.find({}).then(people => {
    return response.send(`<!DOCTYPE html><p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  return Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => person ? response.json(person) : response.status(404).end())
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end()) // eslint-disable-line no-unused-vars
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = { name: request.body.name, number: request.body.number }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(update => response.json(update))
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body) {
    return response.status(400).json({ error: 'missing request body' })
  }
  if (!request.body.name) {
    return response.status(400).json({ error: 'missing name' })
  }
  if (!request.body.number) {
    return response.status(400).json({ error: 'missing number' })
  }
  Person.find({ name: request.body.name }).then(people => {
    if (people.length === 0) {
      const person = new Person({ name: request.body.name, number: request.body.number })
      return person.save()
        .then(saved => response.json(saved))
        .catch(error => next(error))
    }
    return response.status(400).json({ error: 'name is not unique' })
  })
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

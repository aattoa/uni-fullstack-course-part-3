const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message: 'Expected number formatted as xxx-xxxxx'
    },
    minlength: 8,
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

console.log(`connecting to ${url}`)
mongoose.connect(url)
  .then(result => { // eslint-disable-line no-unused-vars
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

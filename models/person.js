const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({ name: String, number: String })

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
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

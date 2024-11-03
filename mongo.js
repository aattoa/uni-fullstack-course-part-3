const mongoose = require('mongoose')

const make_url = (password) => `mongodb+srv://adminuser:${password}@cluster0.2s61z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const personSchema = new mongoose.Schema({ name: String, number: String })
const Person = mongoose.model('Person', personSchema)
mongoose.set('strictQuery', false)

const add_record = (url, name, number) => {
  mongoose.connect(url)
  const person = new Person({ name, number })
  person.save().then(result => {
    mongoose.connection.close()
  })
}

const show_records = (url) => {
  mongoose.connect(url)
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length == 3) {
  show_records(make_url(process.argv[2]))
}
else if (process.argv.length == 5) {
  add_record(make_url(process.argv[2]), process.argv[3], process.argv[4])
}
else {
  console.log('invalid argument count')
}

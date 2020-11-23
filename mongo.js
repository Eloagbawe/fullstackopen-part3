const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.20nm4.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${name}`,
  number: `${number}`,
  date: new Date(),
})


if (process.argv.length === 3){
  Person.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length > 3){
  person.save().then(() => {
    console.log('entry saved!')
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
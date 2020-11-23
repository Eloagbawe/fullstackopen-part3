const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const Person = require('./models/person.js')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('data', function(req) {
  return JSON.stringify(req.body)

})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.post('/api/persons',(req,res,next) => {
  const body = req.body

  if (!body.name){
    return res.status(400).json({
      error: 'name missing'
    })
  }
  else if(!body.number){
    return res.status(400).json({
      error: 'number missing'
    })
  }

  else {
    const newName = new Person({
      name: body.name,
      number: body.number,
      date: new Date()
    })

    newName.save().then(person => {
      return person.toJSON()
    })
      .then(savedAndFormattedPerson => {
        res.json(savedAndFormattedPerson)
      })
      .catch(error => next(error))
  }

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req,res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people </p>
      <p>${Date()}</p>`)
  })
})

app.get('/api/persons/:id', (req,res) => {
  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person)
    }
    else{
      res.status(404).end()
    }
  })
    .catch(err => {
      console.log(err)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  Person.findByIdAndUpdate(req.params.id, { number: body.number }, { new: true, runValidators: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`)
})

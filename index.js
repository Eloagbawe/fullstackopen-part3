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
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', function(req, res) {
  return JSON.stringify(req.body);

});

app.post('/api/persons',(req,res) =>{
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
    
        newName.save().then(person =>{
          res.json(person)
        })
      }  
      
  })

  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
  })

  app.get('/info', (req,res) => {
      Person.find({}).then(persons =>{
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
        res.status(400).send({error: 'malformatted id'})
      })  
  })

  app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
  })
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`)
  })

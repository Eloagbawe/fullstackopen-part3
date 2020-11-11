const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', function(req, res) {
  return JSON.stringify(req.body);

});

let persons = [
    {
      "name": "Arto Hellas",
      "number": "145-782-1098",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Ariana Jones",
      "number": "99-43-7383821",
      "id": 5
    },
    {
      "name": "Beatrice Martins",
      "number": "29-54-6122583",
      "id": 6
    },
    {
      "name": "Calvin Williams",
      "number": "79-90-8423223",
      "id": 7
    },
    {
      "name": "David Holmes",
      "number": "039-24-1587234",
      "id": 8
    },
    {
      "name": "Alice Dakota",
      "number": "234-789-671",
      "id": 9
    },
    {
      "name": "Candace Ceasar",
      "number": "39-78-0921121",
      "id": 10
    },
    {
      "name": "Sarah Brown",
      "number": "176-098-7811",
      "id": 11
    },
    {
      "name": "Ken Jeong",
      "number": "34-190-87651",
      "id": 12
    }
  ]

  app.post('/api/persons',(req,res) =>{
      const body = req.body
      const foundName = persons.find(person => person.name === body.name)
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
      else if(foundName){
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
      }
      else {
        const newName = {
            "name": body.name,
            "number": body.number,
            "id": Math.round(Math.random() * 200)
        }
    
        persons = persons.concat(newName)
        res.json(newName)
      }

      
      
      
  })
  app.get('/api/persons', (req,res) => {
      res.json(persons)
  })

  app.get('/info', (req,res) =>{
      res.send(`<p>Phonebook has info for ${persons.length} people </p>
      <p>${Date()}</p>`)
  })
  app.get('/api/persons/:id', (req,res) =>{
      const id = Number(req.params.id)
      const person = persons.find(person => person.id === id)

      if (person){
          res.json(person)
      }
      else {
          res.status(404).end()
      }
  })
  app.delete('/api/persons/:id', (req,res) =>{
      const id = Number(req.params.id)
      const person = persons.find(person => person.id === id)
      const updatedPersons = persons.filter(person => person.id !== id)

      if (person) {
          res.json(updatedPersons)
      }
      else {
        res.status(404).end()
      }
  })
  const PORT = 3001
  app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`)
  })

const express = require('express')
var morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.json())
morgan.token('type', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan('tiny'))
app.use(morgan(':type'))
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = (max) => {
    min = Math.ceil(0);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => {
        return p.id === Number(id)
    });
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
    console.log('persons after delete:', persons);
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('body:', body);
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({ 
            error: 'name already in phonebook' 
          })
    }
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(9999),
    }
    persons = persons.concat(person)
    response.json(person)
  })

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
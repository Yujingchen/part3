
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()



app.use(express.static('build'))
app.use(express.json())
morgan.token('reqBody', function (request, response) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :reqBody')
)
app.use(cors())

// let persons =
//     [
//         {
//             "name": "Arto Hellas",
//             "number": "1234567",
//             "id": 1
//         },
//         {
//             "name": "Ada Lovelace",
//             "number": "234-123-556",
//             "id": 2
//         },
//         {
//             "name": "Dan Abramov",
//             "number": "12-43-234345",
//             "id": 3
//         },
//         {
//             "name": "Mary Poppendieck",
//             "number": "39-23-6423122",
//             "id": 4
//         },
//         {
//             "name": "Mike Soft",
//             "number": "243-1234-34231",
//             "id": 5
//         }
//     ]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.get('/api/persons/:id', (request, response, next) => {
  let id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  }).catch(error => {
    console.log(error)
    next(error)
  })
})
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    let contactsLength = persons.length
    let currentTime = new Date()
    let info = `Phonebook has info for ${contactsLength} people \n ${currentTime}`
    response.send(info)
  })
})
// app.delete('/api/persons/:id', (request, response) => {
//     let id = Number(request.params.id)
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })
// const generateId = () => {
//     let newId = Math.floor(Math.random() * 1000000)
//     // let maxId = persons.length > 0 ?
//     //     Math.max(...persons.map(p => p.id)) : 0
//     return newId
// }
app.post('/api/persons', (request, response, next) => {
  let body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'contact info missing'
    })
  }
  Person.find({}).then(persons => {
    //checking if name is unique
    if (persons.find(p => p.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    else {
      let person = new Person({
        name: body.name,
        number: body.number
      })
      person.save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
          console.log(savedAndFormattedPerson)
          response.json(savedAndFormattedPerson)
        }
        ).catch(error => next(error))
    }

    //no checking name
    // let person = new Person({
    //     name: body.name,
    //     number: body.number
    // })
    // person.save()
    //     .then(savedPerson => savedPerson.toJSON())
    //     .then(savedAndFormattedPerson => {
    //         console.log(savedAndFormattedPerson)
    //         response.json(savedAndFormattedPerson)
    //     }
    //     ).catch(error => next(error))
  }).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
    console.log(updatedPerson)
    response.json(updatedPerson)
  }).catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    console.log(result)
    response.status(204).end()
  }).catch(error => {
    next(error)
  })
})

// Person.create({ name: "elien", number: "20155501-23" })
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(404).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const Port = process.env.PORT
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`)
})

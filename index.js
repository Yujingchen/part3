
const express = require('express');
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(express.json())
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :reqBody')
)
app.use(cors())

let persons =
    [
        {
            "name": "Arto Hellas",
            "number": "1234567",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "234-123-556",
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
            "name": "Mike Soft",
            "number": "243-1234-34231",
            "id": 5
        }
    ]

app.get('/', (req, res) => {
    res.send('<h1>Hellow World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    let person = persons.find(person => person.id === id)
    person ? response.json(person) : response.status(404).end();

})
app.get('/info', (request, response) => {
    let contactsLength = persons.length
    let currentTime = new Date()
    let info = `Phonebook has info for ${contactsLength} people \n ${currentTime}`
    response.send(info)
})

app.delete('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    let newId = Math.floor(Math.random() * 1000000)
    // let maxId = persons.length > 0 ?
    //     Math.max(...persons.map(p => p.id)) : 0
    return newId
}


app.post('/api/persons', (request, response) => {
    let person = request.body
    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'contact info missing'
        })
    }
    else if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    person.id = generateId(persons)
    persons = persons.concat(person)
    response.json(person)
})


app.use(unknownEndpoint)

const Port = process.env.PORT || 3001
app.listen(Port, () => {
    console.log(`Server running on port ${Port}`)
}) 

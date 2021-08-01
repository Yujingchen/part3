const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please ptovide the password as an argu,emt: node mongo.js <Passowrd>')
  process.exit(1)
}


const password = process.argv[2]
console.log(password);
const url = `mongodb+srv://mgadmin:${password}@cluster0.fqi4y.mongodb.net/test?retryWrites=true&w=majority`
// const url = 'mongodb+srv://mgadmin:4mI1wpebTg@cluster0.fqi4y.mongodb.net/contacts?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(() => {
    console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

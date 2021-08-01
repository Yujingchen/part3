const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
require('dotenv').config()

const url = process.env.MONGODB_URI
if (!url) {
  console.log('Please ptovide connection MongoDB URI to start using the DB');
  process.exit(1)
}
else {
  console.log('connecting to', url)
}

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log(result)
    console.log('connected to mongo db')
})
  .catch((error) => {
    console.log('error connecting to mongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  id:{
  type: Number,
  required: true,
  unique: true
  },
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    // validate: {
    //     validator: function (v) {
    //         return /\d{3}\d{3}\d{4}/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid phone number!`
    // },
    required: [true, 'number is required!!!'],
  },
})

personSchema.plugin(uniqueValidator)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('Person', personSchema)
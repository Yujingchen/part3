
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    console.log('connected to mongo db')
})
    .catch((error) => {
        console.log('error connecting to mongoDB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    number: {
        type: String,
        // validate: {
        //     validator: function (v) {
        //         return /\d{3}\d{3}\d{4}/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        // },
        required: [true, "number is required!!!"],
    },

})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
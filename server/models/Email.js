const mongoose = require('mongoose')

const EmailSchema = new mongoose.Schema({
    emails: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Email', EmailSchema)
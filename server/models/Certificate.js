const mongoose = require('mongoose')

const CertificateSchema = new mongoose.Schema({
    cert_url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['valid', 'invalid'],
        default: 'valid'
    },
    history: [
        {
            adminId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = mongoose.model('Certificate', CertificateSchema)
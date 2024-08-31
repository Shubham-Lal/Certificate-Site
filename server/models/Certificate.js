const mongoose = require('mongoose')

const CertificateSchema = new mongoose.Schema({
    file: {
        _id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    issued: {
        for: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    },
    valid: {
        type: Boolean,
        default: true
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
}, { timestamps: true })

module.exports = mongoose.model('Certificate', CertificateSchema)
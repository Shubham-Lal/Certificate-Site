const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const cache = require('../config/cache.config')

const verifyCookie = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' })

        const adminId = cache.get(token)
        if (!adminId) {
            return res.status(401).json({ success: false, message: 'Unauthorized or token expired' })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
                    cache.del(token)
                    return res.status(401).json({ success: false, message: 'Token expired or invalid' })
                }
                return res.status(401).json({ success: false, message: 'Unauthorized' })
            }

            const admin = await Admin.findById(decoded.id)
            if (!admin) return res.status(401).json({ success: false, message: 'Invalid token' })

            req.admin = admin
            next()
        })
    } catch (err) {
        res.status(401).json({ success: false, message: 'Unauthorized' })
    }
}

module.exports = verifyCookie
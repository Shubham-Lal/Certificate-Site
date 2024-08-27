const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const admin = await Admin.findById(decoded.id)

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid token' })
        }

        req.admin = admin
        next()
    } catch (err) {
        res.status(401).json({ success: false, message: 'Unauthorized' })
    }
}

module.exports = authenticate

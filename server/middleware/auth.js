const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' })

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
                    await Admin.updateOne(
                        { 'auth.token': token },
                        { $pull: { auth: { token } } }
                    )
                    return res.status(401).json({ success: false, message: 'Token expired or invalid' })
                }
                return res.status(401).json({ success: false, message: 'Unauthorized' })
            }

            const admin = await Admin.findOne({ _id: decoded.id, 'auth.token': token })
            if (!admin) return res.status(401).json({ success: false, message: 'Invalid token' })

            req.admin = admin
            next()
        })
    } catch (err) {
        res.status(401).json({ success: false, message: 'Unauthorized' })
    }
}

module.exports = authenticate
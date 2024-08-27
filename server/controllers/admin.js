const Email = require('../models/Email')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports.signupUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required' })
    else if (!password || !password.trim()) return res.status(400).json({ success: false, message: 'Password is required' })

    try {
        const emailDoc = await Email.findOne({})
        if (!emailDoc || !emailDoc.emails.includes(email)) {
            return res.status(400).json({ success: false, message: 'Email not allowed' })
        }

        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        const admin = new Admin({ email, password })
        await admin.save()

        res.status(201).json({ success: true, message: 'Signup successfull' })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required' })
    else if (!password || !password.trim()) return res.status(400).json({ success: false, message: 'Password is required' })

    try {
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Account not found' })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Password is incorrect' })
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? 'Strict' : 'None',
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.BACKEND_URL,
            maxAge: 3600000
        })

        res.status(200).json({ success: true, message: 'Login successful', data: { email: admin.email } })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? 'Strict' : 'None',
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.BACKEND_URL,
            expires: new Date(0)
        })

        res.status(200).json({ success: true, message: 'Logout successful' })
    } catch (error) {
        console.error('Logout error:', error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.autoLogin = (req, res) => {
    res.status(200).json({ success: true, message: 'User is logged in', data: { email: req.admin.email } });
}
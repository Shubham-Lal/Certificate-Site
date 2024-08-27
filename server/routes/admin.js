const express = require('express')
const router = express.Router()
const {
    signupUser,
    loginUser,
    logoutUser,
    autoLogin
} = require('../controllers/admin.js')
const authenticate = require('../middleware/auth.js')

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/authenticate', authenticate, autoLogin)

module.exports = router
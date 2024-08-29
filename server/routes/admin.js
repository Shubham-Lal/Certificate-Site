const express = require('express')
const router = express.Router()
const {
    signupUser,
    loginUser,
    logoutUser,
    autoLogin,
    uploadCertificate
} = require('../controllers/admin.js')
const authenticate = require('../middleware/auth.js')
const upload = require('../config/multer.config.js')

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/authenticate', authenticate, autoLogin)
router.post('/upload', authenticate, upload.single('certificate'), uploadCertificate)

module.exports = router
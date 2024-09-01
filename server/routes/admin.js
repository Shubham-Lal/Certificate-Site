const express = require('express')
const router = express.Router()
const {
    signupUser,
    loginUser,
    logoutUser,
    autoLogin,
    createCertificate,
    editCertificate,
    fetchCertificates
} = require('../controllers/admin.js')
const authenticate = require('../middleware/auth.js')
const upload = require('../config/multer.config.js')

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/authenticate', authenticate, autoLogin)
router.post('/upload', authenticate, upload.single('certificate'), createCertificate)
router.put('/upload', authenticate, upload.single('certificate'), editCertificate)
router.get('/certificates', authenticate, fetchCertificates)

module.exports = router
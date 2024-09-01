const express = require('express')
const router = express.Router()
const {
    signupUser,
    loginUser,
    logoutUser,
    autoLogin,
    fetchCertificates,
    createCertificate,
    editCertificate,
    deleteCertificate
} = require('../controllers/admin.js')
const authenticate = require('../middleware/auth.js')
const upload = require('../config/multer.config.js')

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/authenticate', authenticate, autoLogin)
router.get('/certificate', authenticate, fetchCertificates)
router.post('/certificate', authenticate, upload.single('certificate'), createCertificate)
router.put('/certificate', authenticate, upload.single('certificate'), editCertificate)
router.delete('/certificate/:certificateID', authenticate, deleteCertificate)

module.exports = router
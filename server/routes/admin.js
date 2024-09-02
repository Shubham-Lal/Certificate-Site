const express = require('express')
const router = express.Router()
const {
    signupUser,
    loginUser,
    logoutUser,
    autoLogin,
    fetchAllCertificate,
    fetchSingleCertificate,
    createCertificate,
    editCertificate,
    deleteCertificate
} = require('../controllers/admin.js')
const authenticate = require('../middleware/auth.js')
const upload = require('../config/multer.config.js')

function multerErrorHandler(err, req, res, next) {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File size exceeds the limit of 5 MB' })
        else if (err.message === 'Invalid file type. Only PDF file is allowed') return res.status(400).json({ success: false, message: err.message })
        else return res.status(500).json({ success: false, message: 'An error occurred during file upload' })
    }
    next()
}

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/authenticate', authenticate, autoLogin)
router.get('/certificate', authenticate, fetchAllCertificate)
router.get('/certificate/:certificateID', authenticate, fetchSingleCertificate)
router.post('/certificate', authenticate, upload.single('certificate'), multerErrorHandler, createCertificate)
router.put('/certificate', authenticate, upload.single('certificate'), multerErrorHandler, editCertificate)
router.delete('/certificate/:certificateID', authenticate, deleteCertificate)

module.exports = router
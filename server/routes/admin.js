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

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     summary: Create admin account
 *     tags: [Create Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: 'Test User'
 *               email:
 *                 type: string
 *                 default: 'admin3@gmail.com'
 *               password:
 *                 type: string
 *                 default: '123456'
 *     responses:
 *       201:
 *         description: Signup successfull
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Signup successfull'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Email is required'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.post('/signup', signupUser)

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Sign in to admin account
 *     tags: [Login Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: 'admin1@gmail.com'
 *               password:
 *                 type: string
 *                 default: '123456'
 *     responses:
 *       201:
 *         description: Login successfull
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Login successfull'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Password is required'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.post('/login', loginUser)

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Log out from admin account
 *     tags: [Logout Account]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device:
 *                 type: string
 *                 enum: ['single', 'all']
 *                 default: 'single'
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Logout successful'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Invalid token'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.post('/logout', logoutUser)

/**
 * @swagger
 * /api/admin/authenticate:
 *   get:
 *     summary: Auto login to admin account
 *     tags: [Auto Login]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Auto Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Login successful'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Invalid token'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/authenticate', authenticate, autoLogin)

/**
 * @swagger
 * /api/admin/certificate:
 *   get:
 *     summary: Fetch all certificates
 *     tags: [Fetch certificates]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Fetch successfull
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/certificate', authenticate, fetchAllCertificate)

/**
 * @swagger
 * /api/admin/certificate/66d806dbaecc33331cada255:
 *   get:
 *     summary: Fetch certificate details
 *     tags: [Fetch certificate]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Fetch successfull
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   example: {}
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Certificate ID is required'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/certificate/:certificateID', authenticate, fetchSingleCertificate)

/**
 * @swagger
 * /api/admin/certificate:
 *   post:
 *     summary: Create certificate
 *     tags: [Create Certificate]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               issued_for:
 *                 type: string
 *                 description: Issued for
 *                 default: 'Certificate of Excellence'
 *               issued_to:
 *                 type: string
 *                 description: Issued to
 *                 default: 'Jane Smith'
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate file
 *     responses:
 *       201:
 *         description: Certificate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Certificate uploaded'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Choose a file to upload'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.post('/certificate', authenticate, upload.single('certificate'), multerErrorHandler, createCertificate)

/**
 * @swagger
 * /api/admin/certificate:
 *   put:
 *     summary: Update certificate
 *     tags: [Update Certificate]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               certificate_id:
 *                 type: string
 *                 description: Certificate ID
 *                 default: '66d806dbaecc33331cada255'
 *               issued_for:
 *                 type: string
 *                 description: Issued for
 *                 default: 'Certificate of Appreciation'
 *               issued_to:
 *                 type: string
 *                 description: Issued to
 *                 default: 'Michael Fine'
 *               is_valid:
 *                 type: boolean
 *                 description: Certificate status
 *                 default: false
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate file
 *     responses:
 *       201:
 *         description: Certificate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Certificate updated'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Certificate ID is required'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.put('/certificate', authenticate, upload.single('certificate'), multerErrorHandler, editCertificate)

/**
 * @swagger
 * /api/admin/certificate/66d806dbaecc33331cada255:
 *   delete:
 *     summary: Delete certificate
 *     tags: [Delete certificate]
 *     securitySchemes:
 *       cookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: token
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Fetch successfull
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Certificate deleted'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Certificate ID is required'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.delete('/certificate/:certificateID', authenticate, deleteCertificate)

module.exports = router
const express = require('express')
const router = express.Router()
const { viewCertificate } = require('../controllers/public.js')

/**
 * @swagger
 * /api/public/certificate/66d806dbaecc33331cada255:
 *   get:
 *     summary: Fetch certificate details
 *     tags: [Fetch certificate]
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
router.get('/certificate/:certificateID', viewCertificate)

module.exports = router
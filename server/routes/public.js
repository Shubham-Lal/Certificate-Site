const express = require('express')
const router = express.Router()
const { viewCertificate } = require('../controllers/public.js')

router.get('/certificate/:certificateID', viewCertificate)

module.exports = router
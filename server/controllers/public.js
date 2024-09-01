const Certificate = require('../models/Certificate')

module.exports.viewCertificate = async (req, res) => {
    const { certificateID } = req.params

    if (!certificateID || !certificateID.trim()) return res.status(400).json({ success: false, message: 'Certificate ID is required' })

    try {
        const certificate = await Certificate.findById(certificateID).select('-history')
        if (!certificate) {
            return res.status(400).json({ success: false, message: 'Certificate not found' })
        }

        res.status(201).json({ success: true, data: certificate })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
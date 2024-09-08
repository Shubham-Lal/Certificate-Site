const Email = require('../models/Email')
const Admin = require('../models/Admin')
const Certificate = require('../models/Certificate')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cache = require('../config/cache.config.js')
const { s3Client } = require('../config/aws.config.js')
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { v4: uuidv4 } = require('uuid')

module.exports.signupUser = async (req, res) => {
    const { name, email, password } = req.body

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

        const admin = new Admin({ name, email, password })
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
        cache.set(token, admin._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? 'Strict' : 'None',
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.BACKEND_URL,
            maxAge: 3600000
        })

        res.status(200).json({
            success: true,
            message: 'Login successful'
        })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        const { device } = req.body
        const token = req.cookies.token
        if (!token) return res.status(400).json({ success: false, message: 'No token provided' })

        if (device === 'single') cache.del(token)
        else if (device === 'all') {
            const adminId = cache.get(token)
            cache.keys().forEach(key => {
                const cachedAdminId = cache.get(key)
                if (cachedAdminId.toString() === adminId.toString()) cache.del(key)
            })
        }

        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'development' ? 'Strict' : 'None',
            domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.BACKEND_URL,
            expires: new Date(0)
        })

        res.status(200).json({ success: true, message: 'Logout successful' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.autoLogin = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Login successful'
    })
}

module.exports.fetchAllCertificate = async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ updatedAt: -1 }).exec()
        res.status(200).json({ success: true, data: certificates })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.fetchSingleCertificate = async (req, res) => {
    const { certificateID } = req.params

    if (!certificateID || !certificateID.trim()) return res.status(400).json({ success: false, message: 'Certificate ID is required' })

    try {
        const certificate = await Certificate.findById(certificateID).populate('history.admin_id', 'name email')
        if (!certificate) {
            return res.status(400).json({ success: false, message: 'Certificate not found' })
        }

        certificate.history.sort((a, b) => b.timestamp - a.timestamp)

        res.status(201).json({ success: true, data: certificate })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports.createCertificate = async (req, res) => {
    const { issued_for, issued_to } = req.body

    if (!req.file) return res.status(400).json({ success: false, message: 'Choose a file to upload' })
    else if (!issued_for || !issued_for.trim()) return res.status(400).json({ success: false, message: 'Certificate subject is required' })
    else if (!issued_to || !issued_to.trim()) return res.status(400).json({ success: false, message: 'Certificate recipient is required' })

    try {
        const fileID = `certificates/${uuidv4()}.pdf`

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileID,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read'
        }

        await s3Client.send(new PutObjectCommand(uploadParams))

        const fileURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileID}`

        const newCertificate = new Certificate({
            file: { _id: fileID, url: fileURL },
            issued: { for: issued_for, to: issued_to },
            history: [{ admin_id: req.admin._id, changes: 'Created certificate' }]
        })

        await newCertificate.save()

        res.status(201).json({ success: true, message: 'Certificate uploaded' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.editCertificate = async (req, res) => {
    const { certificate_id, issued_for, issued_to, is_valid } = req.body

    if (!certificate_id) return res.status(400).json({ success: false, message: 'Certificate ID is required' })
    else if (!issued_for || !issued_for.trim()) return res.status(400).json({ success: false, message: 'Certificate subject is required' })
    else if (!issued_to || !issued_to.trim()) return res.status(400).json({ success: false, message: 'Certificate recipient is required' })
    else if (is_valid === undefined || is_valid === null) return res.status(400).json({ success: false, message: 'Certificate status is required' })

    try {
        const certificate = await Certificate.findById(certificate_id)
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' })
        }

        let file = certificate.file

        if (req.file) {
            try {
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: file._id
                    })
                )
            } catch (err) {
                return res.status(500).json({ success: false, message: 'Error deleting previous certificate file' })
            }

            const fileID = `certificates/${uuidv4()}.pdf`

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileID,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read'
            }

            try {
                await s3Client.send(new PutObjectCommand(uploadParams))
                const fileURL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileID}`

                file = { _id: fileID, url: fileURL }
            } catch (err) {
                return res.status(500).json({ success: false, message: 'Error uploading new certificate file' })
            }
        }

        let changes = []
        if (file.url !== certificate.file.url) changes.push('file')
        if (issued_for !== certificate.issued.for) changes.push('subject')
        if (issued_to !== certificate.issued.to) changes.push('recipient name')
        if (is_valid !== certificate.valid.toString()) changes.push('status')

        await Certificate.findByIdAndUpdate(certificate_id, {
            file,
            issued: { for: issued_for, to: issued_to },
            valid: is_valid,
            ...changes.length && {
                $push: {
                    history: {
                        admin_id: req.admin._id,
                        changes: `Updated Certificate ${changes.join(', ')}`
                    }
                }
            }
        })

        res.status(201).json({ success: true, message: 'Certificate updated' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports.deleteCertificate = async (req, res) => {
    const { certificateID } = req.params
    if (!certificateID) return res.status(400).json({ success: false, message: 'Certificate ID is required' })

    try {
        const certificate = await Certificate.findById(certificateID)
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' })
        }

        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: certificate.file._id
                })
            )
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Error deleting file from S3' })
        }

        await Certificate.findByIdAndDelete(certificateID)

        res.status(200).json({ success: true, message: 'Certificate deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}